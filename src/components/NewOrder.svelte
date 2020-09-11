<script>

	import Button from './Button.svelte'
	import Input from './Input.svelte'

	import { selectedProduct, selectedSide, selectedProductMaxAmount, selectedProductAddress } from '../stores/products.js'
	import { selectedAccount, allowances } from '../stores/accounts.js'
	
	import { showModal } from '../stores/modals.js'

	let amount;

	function submitOrder() {
		const { product } = $selectedProduct;
		const { currency } = $selectedAccount;

		showModal('review-order', {
			product: product,
			address: $selectedProductAddress,
			amount,
			side: $selectedSide,
			currency
		});

		amount = undefined;

	}

</script>

<style>
	
</style>

<div>
	<a on:click={() => {selectedSide.set($selectedSide == 'buy' ? 'sell' : 'buy')}}>{$selectedSide == 'buy' ? 'Buy' : 'Sell'}</a> › <a on:click={() => {showModal('products', {})}}>{$selectedProduct.product}</a> with <a on:click={() => {showModal('accounts', {})}}>{$selectedAccount.currency}</a>
</div>
<form on:submit|preventDefault={submitOrder}>
<div><Input placeholder={'0.0 ' + ($selectedSide == 'buy' ? $selectedAccount.currency : $selectedProduct.product)} bind:value={amount} min={1} max={$selectedProductMaxAmount} /></div>
<div><Button text={($selectedSide == 'buy' ? 'Buy' : 'Sell') + " " + $selectedProduct.product} /></div>
</form>