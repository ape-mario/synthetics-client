<script>

	// Accounts list (shown in modal)
	import DataTable from './DataTable.svelte'
	import { orders } from '../stores/transactions.js'

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
<DataTable>
	<div class='header'>
		<span><strong>Recent Orders</strong></span>
	</div>
	{#each $orders as order}
	<div>
		<!-- <span>{transaction.txhash.substring(0, 8)}</span> -->
		{#if order.side == 'buy'}
		<span>{order.amount} {order.currency} >> {order.outputAmount ? `${order.outputAmount} ` : ''}<strong>{order.product}</strong></span>
		{/if}
		{#if order.side != 'buy'}
		<span>{order.amount} <strong>{order.product}</strong> >> {order.outputAmount ? `${order.outputAmount} ` : ''}{order.currency}</span>
		{/if}
		<span>{order.status}</span>
	</div>
	{/each}
</DataTable>
{/if}