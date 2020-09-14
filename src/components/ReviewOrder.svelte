<script>

	import DataTable from './DataTable.svelte'
	import Button from './Button.svelte'

	import { onMount } from 'svelte'
	import { hideModal } from '../stores/modals.js'
	import { showToast } from '../stores/toasts.js'
	import submitBuyOrder from '../lib/eth/submitBuyOrder.js'
	import submitSellOrder from '../lib/eth/submitSellOrder.js'
	import { formatBigInt, parseDecimal } from '../lib/decimals.js'
	import { DEFAULT_PRECISION } from '../lib/constants.js'

	// from modal
	export let data;

	console.log('modal data', data);

	let price = '...', rate;

	let loading;
	function submitOrder() {
		loading = true;
		if (data.side == 'buy') {
			submitBuyOrder({
				symbol: data.product,
				address: data.address,
				currency: data.currency,
				amount: parseDecimal(data.amount, data.decimals)
			}).then((hash) => {
				loading = false;
				showToast('Submitted and awaiting confirmation.', 'success');
				setTimeout(hideModal, 200);
			}).catch((error) => {
				loading = false;
				console.error(error);
				// console.log(getMessageFromCode(error.code));
				showToast(error && error.message);
			});
		} else {
			submitSellOrder({
				symbol: data.product,
				address: data.address,
				currency: data.currency,
				amount: parseDecimal(data.amount, data.decimals)
			}).then((hash) => {
				loading = false;
				showToast('Submitted and awaiting confirmation.', 'success');
				setTimeout(hideModal, 200);
			}).catch((error) => {
				loading = false;
				console.error(error);
				showToast(error && error.message);
			});
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


