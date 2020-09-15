<script>

	import Button from './Button.svelte'
	import Input from './Input.svelte'
	import { selectedProduct, selectedSide, selectedProductMaxAmount, selectedProductAddress, selectedProductBalance } from '../stores/products.js'
	import { selectedAccount, selectedAccountBalance } from '../stores/accounts.js'
	import { SYNTHS_DECIMALS } from '../lib/constants.js'
	import { getCurrencyDecimals } from '../lib/helpers.js'
	import { formatBigInt } from '../lib/decimals.js'
	
	import { showModal } from '../stores/modals.js'

	let amount;

	function submitOrder() {
		const { product } = $selectedProduct;
		const { currency } = $selectedAccount;

		showModal('review-order', {
			product: product,
			address: $selectedProductAddress,
			amount,
			decimals: $selectedSide == 'buy' ? getCurrencyDecimals($selectedAccount) : SYNTHS_DECIMALS,
			side: $selectedSide,
			currency
		});

		amount = undefined;
	}

	async function setMax() {
		const { currency } = $selectedAccount;

		if ($selectedSide == 'buy') {
			const decimals = getCurrencyDecimals($selectedAccount);
			amount = formatBigInt($selectedAccountBalance, decimals, decimals);
		} else {
			const balance = await $selectedProductBalance;
			amount = formatBigInt(balance, SYNTHS_DECIMALS, SYNTHS_DECIMALS);
		}
	}

</script>

<style>
	.input-container {
		position: relative;
	}
	.input-container a {
		text-transform: none;
	}
	.input-container .input-label {
		position: absolute;
	    z-index: 2;
	    right: 8px;
	    height: 52px;
	    display: inline-flex;
	    align-items: center;
	    font-size: 16px;
	}
</style>

<div>
	<a on:click={() => {selectedSide.set($selectedSide == 'buy' ? 'sell' : 'buy')}}>{$selectedSide == 'buy' ? 'Buy' : 'Sell'}</a> › <a on:click={() => {showModal('products', {})}}>{$selectedProduct.product}</a> with <a on:click={() => {showModal('accounts', {})}}>{$selectedAccount.currency}</a>
</div>
<form on:submit|preventDefault={submitOrder}>
<div class='input-container'>
	<Input placeholder={'0.0 ' + ($selectedSide == 'buy' ? $selectedAccount.currency : $selectedProduct.product)} bind:value={amount} min={1} max={$selectedProductMaxAmount} /><a on:click={setMax}><span class='input-label'>max</span></a>
</div>
<div><Button text={($selectedSide == 'buy' ? 'Buy' : 'Sell') + " " + $selectedProduct.product} /></div>
</form>