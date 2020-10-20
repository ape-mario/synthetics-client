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
	/* .main-class {
		color: var(--color-main);
	} */
	/* .container {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		padding: 30px;
		width: 100%;
		max-width: var(--container-width);
	} */
	.body-container {
		position: relative;
		margin: 0;
	}
</style>

<link rel='stylesheet' href='/index.css'> 

<Header/>
<div class="mb-16 max-w-lg mx-auto px-8" style="min-height: calc(100vh - 22rem);">
	<Toast/>
		<div class='body-container'>
			<ModalContainer/>
			<NewOrder selectedProduct={$selectedProduct} selectedAccount={$selectedAccount} />
			<Account/>
			<Transactions/>
		</div>
</div>
<Footer/>

