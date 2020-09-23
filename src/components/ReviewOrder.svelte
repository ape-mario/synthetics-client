<script>

	import DataTable from './DataTable.svelte'
	import Button from './Button.svelte'

	import { onMount } from 'svelte'
	import { hideModal } from '../stores/modals.js'
	import { showToast } from '../stores/toasts.js'
	import { pendingTransactions, recentTransactions } from '../stores/transactions.js'
	import submitBuyOrder from '../lib/eth/submitBuyOrder.js'
	import submitSellOrder from '../lib/eth/submitSellOrder.js'
	import { formatBigInt, parseDecimal } from '../lib/decimals.js'
	import { DEFAULT_PRECISION, SYNTHS_PRECISION } from '../lib/constants.js'

	// from modal
	export let data;

	// console.log('modal data', data);

	let price = '...', rate;

	let loading;
	async function submitOrder() {
		loading = true;
		const params = {
			symbol: data.product,
			address: data.address,
			currency: data.currency,
			amount: parseDecimal(data.amount, data.decimals)
		}
		try {
			const txhash = (data.side == 'buy') ? await submitBuyOrder(params) : await submitSellOrder(params);
			pendingTransactions.unshift(txhash);
			recentTransactions.unshiftPersist({
				txhash,
				product: data.product,
				side: data.side,
				currency: data.currency,
				amount: formatBigInt(params.amount, data.decimals, (data.side == 'buy') ? DEFAULT_PRECISION : SYNTHS_PRECISION),
				timestamp: Date.now()
			});
			showToast('Submitted and awaiting confirmation.', 'success');
			setTimeout(hideModal, 200);
		} catch (e) {
			console.error(e);
			showToast(e && e.message);
		} finally {
			loading = false;
		}
	}

</script>

<style>
	div span {
		text-transform: capitalize;
	}
</style>

<DataTable>
	<div>
		<span>{data.side} {data.product}</span>
		<span>{data.amount} {data.side == 'buy' ? data.currency : data.product}</span>
	</div>
</DataTable>

<div><Button text='Submit order' onclick={submitOrder} isloading={loading} /></div>


