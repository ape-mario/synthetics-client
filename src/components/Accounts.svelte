<script>

	import { onMount } from 'svelte';
	// Accounts list (shown in modal)
	import DataTable from './DataTable.svelte'
	import { hideModal } from '../stores/modals.js'
	import { selectedAccount, accounts } from '../stores/accounts.js'
	import updateCurrencies from '../lib/updates/updateCurrencies.js'
	import { formatBigInt } from '../lib/decimals.js'
	import { DEFAULT_PRECISION } from '../lib/constants.js'

	onMount(() => {
		window.ethereum && updateCurrencies(0, 0);
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
		<span>{formatBigInt(account.balance, account.decimals, DEFAULT_PRECISION)}</span>
	</div>
</DataTable>
{/each}