import { readable, writable, get, derived } from 'svelte/store'
import { user } from './user'
import { getCurrencyDecimals } from '../lib/helpers.js'
import getTransactionReceipt from '../lib/eth/getTransactionReceipt.js'
import { formatBigInt } from '../lib/decimals.js'
import { keccak256 } from 'js-sha3';
import { DEFAULT_PRECISION, SYNTHS_DECIMALS, SYNTHS_PRECISION } from '../lib/constants.js'

const types = [
	'0x' + keccak256('BuyOrderSubmitted(uint256,address,address,uint256,address)'),
	'0x' + keccak256('SellOrderSubmitted(uint256,address,address,uint256,address)')
]

export const recentEvents = writable(JSON.parse(localStorage.getItem('recent-events') || null) || {});

recentEvents.addPersist = function (new_events) {
	const _recentEvents = get(recentEvents);
	for (const event of new_events) {
		Object.assign(_recentEvents, event);
	}
	localStorage.setItem('recent-events', JSON.stringify(_recentEvents));
	recentEvents.set(_recentEvents);
}

export const recentTransactions = writable(JSON.parse(localStorage.getItem('recent-transactions') || null) || []);

recentTransactions.unshiftPersist = function (transaction) {
	const _recentTransactions = get(recentTransactions);
	_recentTransactions.unshift(Object.assign({user: get(user)}, transaction));
	localStorage.setItem('recent-transactions', JSON.stringify(_recentTransactions));
	recentTransactions.set(_recentTransactions);
}

export const transactions = derived(recentTransactions, async ($recentTransactions, set) => {

	let isPending;
	let interval;

	const updateTransactions = async () => {
		const results = await Promise.allSettled($recentTransactions.map(getTransactionReceipt));
		isPending = false;
		const _transactions = results.map((result, index) => {
			let status = 'N/A';
			let orderId = null;
			if (result.status === 'fulfilled') {
				const tx_receipt = result.value;
				if (tx_receipt) {
					// not pending
					status = parseInt(tx_receipt.status) ? 'queued' : 'failed';

					// extract orderId from emitted event
					const _user = '0x' + $recentTransactions[index].user.slice(2).padStart(64, 0);
					const orderSubmittedEventLogs = tx_receipt.logs.filter(log => types.includes(log.topics[0]) && log.topics[1] == _user);
					if (orderSubmittedEventLogs.length > 0) {
						orderId = BigInt(orderSubmittedEventLogs[0].data.slice(0, 2 + 64));
					}
					
				} else {
					isPending = true;
					status = 'pending';
				}
			}
			return Object.assign({}, $recentTransactions[index], { status, orderId });
		});

		set(_transactions);

		if (!isPending && interval) clearInterval(interval);
	}

	interval = setInterval(updateTransactions, 1000);
	updateTransactions();

	return () => {
		clearInterval(interval);
	};

});

export const orders = derived([transactions, recentEvents], ([$transactions, $recentEvents]) => {
	if (!$transactions) return [];

	return $transactions.map(function (transaction) {
		if (!$recentEvents || !transaction.orderId) return transaction;

		const event = $recentEvents[transaction.orderId];
		if (!event) return transaction;

		if (event.processed) {
			// order processed
			const {
				amount,
				price
			} = event;

			const {
				side,
				currency
			} = transaction;

			const currencyDecimals = getCurrencyDecimals(transaction)
			const formattedAmount = formatBigInt(BigInt(amount), side == 'buy' ? SYNTHS_DECIMALS : currencyDecimals, side == 'buy' ? SYNTHS_PRECISION : DEFAULT_PRECISION);
			const formattedPrice = formatBigInt(BigInt(price), SYNTHS_DECIMALS, DEFAULT_PRECISION);

			return Object.assign({}, transaction, {status: 'processed', outputAmount: formattedAmount, price: formattedPrice});

		} else {
			// order cancelled
			const {
				reason
			} = event;

			return Object.assign({}, transaction, {status: 'cancelled', reason});
		}
	});
})
