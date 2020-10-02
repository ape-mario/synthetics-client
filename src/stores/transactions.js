import { writable, get, derived } from 'svelte/store'
import { user } from './user'
import { chainId } from './network'
import getTransactionReceipt from '../lib/eth/getTransactionReceipt'
import { getLatestOrders, getLatestOrderUpdates } from '../lib/eth/getLatestOrders'
import { formatBigInt } from '../lib/decimals'
import { DEFAULT_PRECISION, SYNTHS_DECIMALS, SYNTHS_PRECISION } from '../lib/constants'
import { ORDER_SUBMITTED_EVENT_TYPES } from '../lib/eventHelpers'

// latestEvents are polled from the blockchain at an interval
export const latestEvents = writable({});
latestEvents.addEvents = function (new_events) {
	latestEvents.update((_latestEvents) => {
		let mergedEvents = Object.assign({}, _latestEvents, new_events);

		// cleanup oldest event
		const idsToCleanup = Object.keys(mergedEvents).sort().slice(0, -10);
		for (const toDelete of idsToCleanup) {
			delete mergedEvents[toDelete];
		}
		return mergedEvents;
	});
}

// latestOrders is updated from the blockchain when the user changes
export const latestOrders = derived([user, chainId], ([$user, $chainId], set) => {
	if (!$user) return;

	const fetchLatestOrders = async () => {
		const { submitted, processed } = await getLatestOrders({ user: $user });
		set(submitted);
		latestEvents.set(processed);
	}

	const updateLatestOrders = async () => {
		const { processed } = await getLatestOrderUpdates({ user: $user });
		if (Object.keys(processed).length > 0) {
			latestEvents.addEvents(processed);
		}
	}

	const interval = setInterval(updateLatestOrders, 5000);
	fetchLatestOrders();

	return () => {
		if (interval) {
			clearInterval(interval);
		}
	}
})

// used to append new pending transaction
export const pendingTransaction = writable(null);

// pendingTransactions is updated om user actions 
export const pendingTransactions = writable({});

const updatePendingTransactions = (params) => {
	const {
		$user,
		$chainId,
		$pendingTransaction
	} = params

	if ($user || $chainId) {

		// handle user changed
		pendingTransactions.update((_pendingTransactions) => {
			if (_pendingTransactions.user == $user && _pendingTransactions.chainId == $chainId) return _pendingTransactions;

			// user or network changed
			return JSON.parse(localStorage.getItem(`pending-transactions-${$user}-${$chainId}`) || null) || {user: $user, chainId: $chainId}
		})

	} else if ($pendingTransaction) {

		pendingTransactions.update((_pendingTransactions) => {
			// make sure user is set before adding the new pending transaction
			if (!_pendingTransactions.user || !_pendingTransactions.chainId || !$pendingTransaction) return _pendingTransactions;
			const transactions = _pendingTransactions.transactions || [];
			transactions.unshift(Object.assign({user: _pendingTransactions.user}, $pendingTransaction));
			const updatedPendingTransactions = Object.assign({}, _pendingTransactions, { transactions: transactions.slice(0, 10) });
			localStorage.setItem(`pending-transactions-${_pendingTransactions.user}-${_pendingTransactions.chainId}`, JSON.stringify(updatedPendingTransactions));
			return updatedPendingTransactions;
		})
	}
}

chainId.subscribe($chainId => updatePendingTransactions({ $user: get(user), $chainId }));
user.subscribe($user => updatePendingTransactions({ $user, $chainId: get(chainId) }));
pendingTransaction.subscribe($pendingTransaction => updatePendingTransactions({ $pendingTransaction }));

// recentTransactions fetches missing information in pendingTransactions from the blockchain
export const recentTransactions = derived(pendingTransactions, ($pendingTransactions, set) => {

	let isPending;
	let interval;

	const updateRecentTransactions = async () => {
		const { transactions } = $pendingTransactions;
		if (!transactions) return set([]);

		const results = await Promise.allSettled(transactions.map(getTransactionReceipt));
		isPending = false;
		const _transactions = results.map((result, index) => {
			let status = 'N/A';
			let id = null;
			if (result.status === 'fulfilled') {
				const tx_receipt = result.value;
				if (tx_receipt) {
					const {
						user,
						txhash,
						timestamp
					} = transactions[index];

					const {
						logs,
						gasUsed,
						blockNumber
					} = tx_receipt;

					// not pending
					status = parseInt(tx_receipt.status) ? 'queued' : 'failed';

					// extract orderId from emitted event
					const _user = '0x' + user.slice(2).padStart(64, 0);
					const orderSubmittedEventLogs = logs.filter(log => ORDER_SUBMITTED_EVENT_TYPES.includes(log.topics[0]) && log.topics[1] == _user);
					if (orderSubmittedEventLogs.length > 0) {
						id = BigInt(orderSubmittedEventLogs[0].data.slice(0, 2 + 64)).toString();
					}

				} else {
					isPending = true;
					status = 'pending';
				}
			}
			return Object.assign({}, transactions[index], { status, id });
		});

		set(_transactions);

		if (!isPending && interval) clearInterval(interval);
	}

	interval = setInterval(updateRecentTransactions, 5000);
	updateRecentTransactions();

	return () => {
		clearInterval(interval);
	};

});

// orders takes merges all the above data for the UI to consume
export const orders = derived([latestOrders, latestEvents, recentTransactions], ([$latestOrders, $latestEvents, $recentTransactions]) => {
	if (!$latestOrders) return [];
	const concatenatedOrders = ($recentTransactions || []).concat($latestOrders || [])
	const uniqConcatenatedOrders = concatenatedOrders.filter((tx, index) => concatenatedOrders.findIndex(data => data.txhash == tx.txhash) == index);
	const allOrders = uniqConcatenatedOrders.sort((a, b) => {
		// ids are only the same if they're null and the orders are pending
		if (a.id == b.id) return a.timestamp > b.timestamp;
		return BigInt(a.id || -1n) > BigInt(b.id || -1n)
	}).slice(0, 10);

	return allOrders.map(function (order) {
		if (!$latestEvents || !order.id) return order;

		const event = $latestEvents[order.id];
		if (!event) return Object.assign({}, order, {status: 'queued'});

		if (event.processed) {
			// order processed
			const {
				amount,
				price
			} = event;

			const {
				side,
				currencyDecimals
			} = order;

			const formattedAmount = formatBigInt(BigInt(amount), side == 'buy' ? SYNTHS_DECIMALS : BigInt(currencyDecimals), side == 'buy' ? SYNTHS_PRECISION : DEFAULT_PRECISION);
			const formattedPrice = formatBigInt(BigInt(price), SYNTHS_DECIMALS, DEFAULT_PRECISION);

			return Object.assign({}, order, {status: 'processed', outputAmount: formattedAmount, price: formattedPrice});

		} else {
			// order cancelled
			const {
				reason
			} = event;

			return Object.assign({}, order, {status: 'cancelled', reason});
		}
	});
})
