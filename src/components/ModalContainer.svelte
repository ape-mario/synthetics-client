<script>

	import { modalActive, hideModal } from '../stores/modals.js'

	import Products from './Products.svelte'
	import Accounts from './Accounts.svelte'
	import ReviewOrder from './ReviewOrder.svelte'

</script>

<style>
	.modal-container {
		background-color: var(--bg-color);
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		display: flex;
		justify-content: center;
		margin: 0;
		z-index: 10;
	}
	.modal {
		position: relative;
		width: 100%;
		margin: 0;
	}

	.modal-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 50px;
		border-bottom: 1px solid var(--border-color);
		margin: 0;
	}

	.modal-body {
		margin: 0;
	}
	
</style>

{#if $modalActive}
<div class='modal-container'>
	<div class='modal'>
		<div class='modal-header'>
			<strong>{$modalActive.data && $modalActive.data.title || $modalActive.name}</strong>
			<a on:click={hideModal}>cancel</a>
		</div>
		<div class='modal-body'>
			{#if $modalActive.name == 'products'}
			<Products data={$modalActive.data} />
			{/if}
			{#if $modalActive.name == 'accounts'}
			<Accounts data={$modalActive.data} />
			{/if}
			{#if $modalActive.name == 'review-order'}
			<ReviewOrder data={$modalActive.data} />
			{/if}
		</div>
	</div>
</div>
{/if}