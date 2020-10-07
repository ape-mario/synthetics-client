<script>

	import { onMount } from 'svelte';

	import Header from '../components/Header.svelte'
	import Account from '../components/Account.svelte'
	import NewOrder from '../components/NewOrder.svelte'
	import Transactions from '../components/Transactions.svelte'
	import Toast from '../components/Toast.svelte'
	import Footer from '../components/Footer.svelte'
	import ModalContainer from '../components/ModalContainer.svelte'
	import { selectedProduct } from '../stores/products.js'
	import { selectedAccount } from '../stores/accounts.js'

</script>

<style>
	.main-class {
		color: var(--color-main);
	}
	.container {
		background-color: #212845;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		padding: 30px;
		width: 100%;
		max-width: var(--container-width);
	}
	.body-container {
		position: relative;
		margin: 0;
	}
</style>

<Header/>
<div class='container'>
	<Toast/>
		<div class='body-container'>
			<ModalContainer/>
			<NewOrder selectedProduct={$selectedProduct} selectedAccount={$selectedAccount} />
			<Account/>
			<Transactions/>
		</div>
</div>
<Footer/>

