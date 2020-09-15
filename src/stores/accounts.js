import { readable, writable, get, derived } from 'svelte/store'
import { CONTRACTS } from '../lib/constants.js'
import { currencies, decimals, symbols } from './currencies'
import { user } from './user'
import { transactions } from './transactions.js'
import { getAssetsAllowance } from '../lib/eth/getAllowance.js'
import getBalance from '../lib/eth/getBalance.js'

let defaultAccount = JSON.parse(localStorage.getItem('selected-currency') || null) || {currency: 'DAI'};
export const selectedAccount = writable(defaultAccount);

selectedAccount.setPersist = (obj) => {
	localStorage.setItem('selected-currency', JSON.stringify(obj));
	selectedAccount.set(obj);
}

export const balances = derived([user, currencies, transactions], async ([$user, $currencies, $transactions], set) => {
	if (!$user) return;
	if (!$currencies) return;

	const results = await Promise.allSettled($currencies.map(getBalance));
	const _balances = results.map((r, i) => ({[$currencies[i].address]: (r.value || 0n)}));
	set(Object.assign({}, ..._balances));
});

export const allowances = derived([user, currencies], async ([$user, $currencies], set) => {
	if (!$user) return;
	if (!$currencies) return;

	const results = await Promise.allSettled($currencies.map(getAssetsAllowance));
	const _allowances = results.map((r, i) => ({[$currencies[i].address]: (r.value || 0n)}));
	set(Object.assign({}, ..._allowances));
});

export const accounts = derived([currencies, balances, allowances, symbols, decimals], ([$currencies, $balances, $allowances, $symbols, $decimals], set) => {
	console.log('$currencies:', $currencies);
	console.log('$balances:', $balances);
	console.log('$allowances:', $allowances);
	console.log('$symbols:', $symbols);

	const createAccount = (currency) => ({
		currency: ($symbols || {[currency.address]: currency.address.substring(0,8)})[currency.address],
		address: currency.address,
		balance: ($balances || {})[currency.address] || 0n,
		allowance: ($allowances || {})[currency.address] || 0n,
		decimals: ($decimals || {})[currency.address] || 18n
	});

	let accounts = $currencies.map(createAccount);
	console.log('accounts:', accounts);
	set(accounts);
});
