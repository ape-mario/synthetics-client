import { readable, writable, get, derived } from 'svelte/store'
import { currencies, addresses, decimals, symbols } from './currencies'
import { user } from './user'
import { chainId } from './network'
import { transactions, recentEvents } from './transactions'
import getBalance from '../lib/eth/getBalance'

let defaultAccount = JSON.parse(localStorage.getItem('selected-currency') || null) || {currency: 'DAI'};
export const selectedAccount = writable(defaultAccount);

selectedAccount.setPersist = (obj) => {
	localStorage.setItem('selected-currency', JSON.stringify(obj));
	selectedAccount.set(obj);
}

export const balances = derived([user, currencies, transactions, recentEvents], async ([$user, $currencies, $transactions, $recentEvents], set) => {
	if (!$user) return;
	if (!$currencies) return;

	const results = await Promise.allSettled($currencies.map(getBalance));
	const _balances = results.map((r, i) => ({[$currencies[i].address]: (r.value || 0n)}));
	set(Object.assign({}, ..._balances));
});

export const selectedAccountBalance = derived([chainId, selectedAccount, balances, addresses], ([$chainId, $selectedAccount, $balances, $addresses]) => {
	if (!$balances) return 0n;
	if (!$addresses) return 0n;

	return $balances[$addresses[$selectedAccount.currency]];
})

export const accounts = derived([currencies, balances, symbols, decimals], ([$currencies, $balances, $symbols, $decimals], set) => {
	// console.log('$currencies:', $currencies);
	// console.log('$balances:', $balances);
	// console.log('$symbols:', $symbols);

	const createAccount = (currency) => ({
		currency: ($symbols || {[currency.address]: currency.address.substring(0,8)})[currency.address],
		address: currency.address,
		balance: ($balances || {})[currency.address] || 0n,
		decimals: ($decimals || {})[currency.address] || 18n
	});

	let accounts = $currencies.map(createAccount);
	// console.log('accounts:', accounts);
	set(accounts);
});
