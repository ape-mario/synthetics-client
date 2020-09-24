<script>

	import { onMount } from 'svelte';

	import Header from '../components/Header.svelte'
	import Nav from '../components/Nav.svelte'
	import Account from '../components/Account.svelte'
	import NewOrder from '../components/NewOrder.svelte'
	import Transactions from '../components/Transactions.svelte'
	import Toast from '../components/Toast.svelte'
	import Footer from '../components/Footer.svelte'
	import ModalContainer from '../components/ModalContainer.svelte'
	import monitorEvents from '../lib/monitor/monitorEvents.js'

	// updates the list of currencies
	if (window.ethereum) {
		$: monitorEvents();
	}

</script>

<style>
	.main-class {
		color: var(--color-main);
	}
	.container {
		width: 100%;
		max-width: var(--container-width);
		margin: 0 auto;
		padding: var(--base-padding);
		position: relative;
	}
	.body-container {
		position: relative;
		margin: 0;
		min-height: 700px;
	}
</style>

<div class='container'>
	<Toast/>
	<Header/>
	<!-- {#if $user} -->
		<div class='body-container'>
			<ModalContainer/>
			<Nav/>
			<NewOrder/>
			<Account/>
			<Transactions/>
		</div>
	<!-- {:else}
		// TODO add page for when metamask is not installed
	{/if} -->
	<Footer/>
</div>

