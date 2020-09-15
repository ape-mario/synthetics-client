<script>

	import DataTable from './DataTable.svelte'
	import { selectedAccount, balances } from '../stores/accounts.js'
	import { addresses, decimals } from '../stores/currencies.js'
	import { selectedProduct, selectedProductBalance } from '../stores/products.js'
	import { formatBigInt } from '../lib/decimals.js'
	import { DEFAULT_PRECISION, DEFAULT_DECIMALS, SYNTHS_DECIMALS, SYNTHS_PRECISION, BIGINT_ZERO } from '../lib/constants.js'

	function getFormattedBalance(selectedAccount, balances, decimals, addresses) {
		const address = addresses[selectedAccount.currency];
		const balance = (balances || {})[address];
		if (balance != undefined) return formatBigInt(balance, (decimals || {})[address] || DEFAULT_DECIMALS, DEFAULT_PRECISION);
		return '...';
	}

</script>

<style>
	
</style>

<DataTable title={'Account (' + $selectedAccount.currency + ')'}>
	<div>
		<span class='has-tooltip' data-tooltip='Current wallet balance.' tabindex='0'>Balance</span>
		<span>{getFormattedBalance($selectedAccount, $balances, $decimals, $addresses)}</span>
	</div>
</DataTable>

<DataTable title={'Account (' + $selectedProduct.product + ')'}>
	<div>
		<span class='has-tooltip' data-tooltip='Current product balance.' tabindex='0'>Balance</span>
		<span>{$selectedProductBalance != undefined && formatBigInt($selectedProductBalance || BIGINT_ZERO, SYNTHS_DECIMALS, SYNTHS_PRECISION) || '...'}</span>
	</div>
</DataTable>