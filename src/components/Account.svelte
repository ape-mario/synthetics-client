<script>

	import DataTable from './DataTable.svelte'

	import { showToast } from '../stores/toasts'
	import { chainId } from '../stores/network'
	import { selectedAccount, balances, faucetUpdate } from '../stores/accounts'
	import { addresses, decimals } from '../stores/currencies'
	import { selectedProduct, selectedProductBalance, selectedProductAddress } from '../stores/products'
	import { formatBigInt } from '../lib/decimals'
	import { DEFAULT_PRECISION, DEFAULT_DECIMALS, SYNTHS_DECIMALS, SYNTHS_PRECISION, BIGINT_ZERO } from '../lib/constants'
	import watchAsset from '../lib/eth/watchAsset'
	import faucetRequest from '../lib/eth/faucetRequest'
	import getTransactionReceipt from '../lib/eth/getTransactionReceipt'
	import { async_timeout } from '../lib/helpers'

	function getFormattedBalance(selectedAccount, balances, decimals, addresses) {
		const address = addresses[selectedAccount.currency];
		const balance = (balances || {})[address];
		if (balance != undefined) return formatBigInt(balance, (decimals || {})[address] || DEFAULT_DECIMALS, DEFAULT_PRECISION);
		return '...';
	}

	function watchAssetAction(selectedProduct, selectedProductAddress) {
		watchAsset({
			symbol: selectedProduct.product,
			address: selectedProductAddress
		});
	}

	async function sendFaucetRequest(params) {
		try {
			const txhash = await faucetRequest(params);
			showToast('Requested tokens from faucet.', 'success');

			let isPending = true;

			while(isPending) {
				const response = await getTransactionReceipt({ txhash });
				if (response) {
					if (parseInt(response.status)) {
						// successful => refresh balance
						faucetUpdate.set(txhash);
						break;
					} else {
						// failed => show toast
						throw new Error('Faucet request failed.');
					}
				}
				await async_timeout(1000);
			}
		} catch (e) {
			console.error(e);
			showToast(e && e.message);
		}
	}

</script>

<style>
	
</style>

<div class="grid lg:grid-cols-2 gap-4">
	<div class="flex flex-col sm:p-1 md:p-4 shadow-lg">
		<DataTable title={$selectedAccount.currency} separator={true} action={ {name: ($chainId != '0x1' ? 'faucet' : ''), handler: () => { sendFaucetRequest({address: $addresses[$selectedAccount.currency]}) }}}>
			<div class="m-0">
				<span class='has-tooltip' data-tooltip='Current wallet balance.' tabindex='0'>Balance</span>
				<span>{getFormattedBalance($selectedAccount, $balances, $decimals, $addresses)}</span>
			</div>
		</DataTable>
	</div>
	<div class="flex flex-col sm:p-1 md:p-4 shadow-lg">
		<DataTable title={$selectedProduct.product} action={{name: ($selectedProductAddress || '').substring(0, 9), handler: () => { watchAssetAction($selectedProduct, $selectedProductAddress) }}}>
			<div class="m-0">
				<span class='has-tooltip' data-tooltip='Current product balance.' tabindex='0'>Balance</span>
				<span>{$selectedProductBalance != undefined && formatBigInt($selectedProductBalance || BIGINT_ZERO, SYNTHS_DECIMALS, SYNTHS_PRECISION) || '...'}</span>
			</div>
		</DataTable>
	</div>
</div>



