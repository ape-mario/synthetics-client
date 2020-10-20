<script>

	// Accounts list (shown in modal)
	import DataTable from './DataTable.svelte'
	import { orders } from '../stores/transactions.js'
	import { ETHERSCAN_URI } from '../lib/constants.js'

</script>

<style>
	div.active {
		font-weight: bold;
	}
	.header {
		cursor: pointer;
	}
</style>

{#if $orders && $orders.length}
<DataTable title={'Recent Orders'} separator={true}>
	{#each $orders as order}
	<div class="mb-2">
		<!-- <span>{transaction.txhash.substring(0, 8)}</span> -->
		{#if order.side == 'buy'}
		<span>{order.decimalAmount} {order.currency} &rarr; {order.outputAmount ? `${order.outputAmount} ` : ''}<strong>{order.product}</strong></span>
		{/if}
		{#if order.side != 'buy'}
		<span>{order.decimalAmount} <strong>{order.product}</strong> &rarr; {order.outputAmount ? `${order.outputAmount} ` : ''}{order.currency}</span>
		{/if}
		{#if order.status == 'pending'}
		<span>{order.status}</span>
		{/if}
		{#if order.status != 'pending'}
		<span>{#if order.status == 'cancelled'}<span class='has-tooltip' data-tooltip={order.reason} tabindex='0'>!!</span> {/if}<a href={`${ETHERSCAN_URI[ethereum.chainId]}/tx/${order.txhash}`} target='_blank'>{order.status}</a></span>
		{/if}
	</div>
	{/each}
</DataTable>
{/if}