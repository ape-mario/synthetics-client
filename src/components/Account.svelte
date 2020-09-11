<script>

	import DataTable from './DataTable.svelte'

	import {
		selectedAccount,
		balances,
		allowances
	} from '../stores/accounts.js'

	import {
		addresses
	} from '../stores/currencies.js'

	import {
		selectedProduct,
		selectedProductBalance,
		selectedProductAddress
	} from '../stores/products.js'

</script>

<style>
	
</style>

<DataTable title={'Account (' + $selectedAccount.currency + ')'}>
	<div>
		<span class='has-tooltip' data-tooltip='Current wallet balance.' tabindex='0'>Balance</span>
		<span>{($balances || {})[$addresses[$selectedAccount.currency]] || '...'}</span>
	</div>
	<div>
		<span class='has-tooltip' data-tooltip='Amount approved for minting synths.' tabindex='0'>Allowance</span>
		<span>{($allowances || {})[$addresses[$selectedAccount.currency]] || '...'}</span>
	</div>
</DataTable>

<DataTable title={'Account (' + $selectedProduct.product + ')'}>
	<div>
		<span class='has-tooltip' data-tooltip='Current wallet balance.' tabindex='0'>Balance</span>
		<span>{$selectedProductBalance || '...'}</span>
	</div>
	<div>
		<span>Contract</span>
		<span>{$selectedProductAddress || '...'}</span>
	</div>
</DataTable>