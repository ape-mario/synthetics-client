<script>

	import DataTable from './DataTable.svelte'

	import { selectedProduct, products } from '../stores/products.js'
	import { hideModal } from '../stores/modals.js'

	function selectProduct(p) {
		selectedProduct.setPersist(p); 
		window.history.pushState('', document.title, '/#/' + p.product);
		setTimeout(() => {hideModal()}, 300);
	}

</script>

<style>
	div {
		cursor: pointer;
	}
	div.active {
		font-weight: bold;
	}
	
</style>

<DataTable>
{#each ($products || []) as p}
<div on:click={() => {selectProduct(p)}} class:active={$selectedProduct.product == p.product}>
	<span>{p.product}</span>
	{#if $selectedProduct.product == p.product}<span>✔</span>{/if}
</div>
{/each}
</DataTable>