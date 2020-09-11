<script>

	import { onMount } from 'svelte';
	// Accounts list (shown in modal)
	import DataTable from './DataTable.svelte'
	import { hideModal } from '../stores/modals.js'
	import { selectedAccount, accounts } from '../stores/accounts.js'
	import updateCurrencies from '../lib/updates/updateCurrencies.js'

	onMount(() => {
		updateCurrencies(0, 0);
	});

	function selectAccount(account) {
		selectedAccount.setPersist({currency: account.currency});
		setTimeout(() => {hideModal()}, 300);
	}

</script>

<style>
	div.active {
		font-weight: bold;
	}
	.header {
		cursor: pointer;
	}
</style>

{#each $accounts as account}
<DataTable>
	<div class='header' class:active={account.currency == $selectedAccount.currency} on:click={() => {selectAccount(account)}}>
		<span><strong>{account.currency}</strong></span>
		{#if account.currency == $selectedAccount.currency}<span>✔</span>{/if}
	</div>
	<div>
		<span>Balance</span>
		<span>{account.balance}</span>
	</div>
	<div>
		<span>Allowance</span>
		<span>{account.allowance}</span>
	</div>
	<div>
		<span>Currency Name</span>
		<span>{account.name}</span>
	</div>
</DataTable>
{/each}