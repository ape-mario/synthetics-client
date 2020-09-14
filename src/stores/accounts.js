import { readable, writable, get, derived } from 'svelte/store'
import { CONTRACTS } from '../lib/constants.js'
import { currencies, decimals, symbols } from './currencies'
import { user } from './user'
import { getAssetsAllowance } from '../lib/eth/getAllowance.js'
import getBalance from '../lib/eth/getBalance.js'

let defaultAccount = JSON.parse(localStorage.getItem('selected-currency') || null) || {currency: 'DAI'};
export const selectedAccount = writable(defaultAccount);

selectedAccount.setPersist = (obj) => {
	localStorage.setItem('selected-currency', JSON.stringify(obj));
	selectedAccount.set(obj);
}

export const balances = derived([user, currencies], ([$user, $currencies], set) => {
	if (!$user) return;
	if (!$currencies) return;

	let _balances = {}

	for (const currency of $currencies) {
		getBalance(currency).then((balance) => {
			_balances[currency.address] = balance;

			if (Object.keys(_balances).length == $currencies.length) {
				console.log('balances###:', _balances);
				set(_balances);
			}
		}).catch((error) => {
			console.error('Ethereum Provider error', currency, error);
		});
	}
});

export const allowances = derived([user, currencies], ([$user, $currencies], set) => {
	if (!$user) return;
	if (!$currencies) return;

	let _allowances = {}

	for (const currency of $currencies) {
		getAssetsAllowance(currency).then((allowance) => {
			_allowances[currency.address] = allowance;

			if (Object.keys(_allowances).length == $currencies.length) {
				console.log('allowances###:', _allowances);
				set(_allowances);
			}
		}).catch((error) => {
			console.error('Ethereum Provider error', currency, error);
		});
	}
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
