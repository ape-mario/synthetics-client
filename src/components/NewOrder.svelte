<script>

	import Button from './Button.svelte'
	import Input from './Input.svelte'

	import { selectedSide, selectedProductMaxAmount, selectedProductAddress, selectedProductBalance } from '../stores/products.js'
	import { selectedAccountBalance } from '../stores/accounts.js'
	import { showModal } from '../stores/modals.js'
	import { SYNTHS_DECIMALS, BIGINT_ZERO } from '../lib/constants.js'
	import { getCurrencyDecimals } from '../lib/helpers.js'
	import { formatBigInt, parseDecimal } from '../lib/decimals.js'

	export let selectedProduct;
	export let selectedAccount;

	let amount;
	let input;

	function getDecimals() {
		return $selectedSide == 'buy' ? getCurrencyDecimals(selectedAccount) : SYNTHS_DECIMALS;
	}

	function submitOrder() {
		const { product } = selectedProduct;
		const { currency } = selectedAccount;

		showModal('review-order', {
			product: product,
			address: $selectedProductAddress,
			amount,
			decimals: getDecimals(),
			side: $selectedSide,
			currency,
			currencyDecimals: getCurrencyDecimals(selectedAccount)
		});

		amount = undefined;
	}

	function validateInput() {
		if (input) {
			if (input.validity.patternMismatch || input.validity.valueMissing) return true;

			const bigIntAmount = parseDecimal(amount, getDecimals());
			const maxBigIntAmount = $selectedSide == 'buy' ? $selectedAccountBalance : $selectedProductBalance;

			if (bigIntAmount == BIGINT_ZERO) {
				input.setCustomValidity('Amount below minimum.');
			} else if (bigIntAmount > maxBigIntAmount) {
				input.setCustomValidity('Insufficient funds.');
			} else if ($selectedSide == 'buy' && bigIntAmount > $selectedProductMaxAmount) {
				input.setCustomValidity('Amount above maximum allowed for this product.');
			} else {
				input.setCustomValidity('');
			}
			return true;
		}
	}

	async function setMax() {
		const { currency } = selectedAccount;
		if ($selectedSide == 'buy') {
			const decimals = getCurrencyDecimals(selectedAccount);
			amount = formatBigInt($selectedAccountBalance, decimals, decimals);
		} else {
			amount = formatBigInt($selectedProductBalance, SYNTHS_DECIMALS, SYNTHS_DECIMALS);
		}
		validateInput();
	}

	function toggleSide() {
		selectedSide.set($selectedSide == 'buy' ? 'sell' : 'buy');
		validateInput();
	}

	function showProducts() {
		showModal('products', {});
	}

	function showAccounts() {
		showModal('accounts', {});
	}

	$: {
		// validate input on every selectedProduct or selectedAccount change
		// referencing selectedProduct & selectedAccount is required to refresh correctly
		validateInput({ selectedProduct, selectedAccount });
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
	<a on:click={toggleSide}>{$selectedSide == 'buy' ? 'Buy' : 'Sell'}</a> › <a on:click={showProducts}>{selectedProduct.product}</a> {$selectedSide == 'buy' ? 'with' : 'for'} <a on:click={showAccounts}>{selectedAccount.currency}</a>
</div>
<form on:submit|preventDefault={submitOrder} on:invalid={validateInput} on:changed={validateInput} on:input={validateInput}>
<div class='input-container'>
	<Input bind:element={input} placeholder={'0.0 ' + ($selectedSide == 'buy' ? selectedAccount.currency : selectedProduct.product)} bind:value={amount} /><a on:click={setMax}><span class='input-label'>max</span></a>
</div>
<div><Button text={($selectedSide == 'buy' ? 'Buy' : 'Sell') + " " + selectedProduct.product} /></div>
</form>
