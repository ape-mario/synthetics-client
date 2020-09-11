import { readable, writable, get, derived } from 'svelte/store'
import { CONTRACTS } from '../lib/constants.js'
import { currencies, decimals, symbols } from './currencies'
import { user } from './user'
import { toUtf8String } from '@ethersproject/strings'
import { getAssetsAllowance } from '../lib/eth/getAllowance.js'
import getBalance from '../lib/eth/getBalance.js'
import BN from 'bn.js'

let defaultAccount = JSON.parse(localStorage.getItem('selected-currency') || null) || {currency: 'DAI'};
export const selectedAccount = writable(defaultAccount);

selectedAccount.setPersist = (obj) => {
	localStorage.setItem('selected-currency', JSON.stringify(obj));
	selectedAccount.set(obj);
}

export const balances = derived([user, currencies, decimals], ([$user, $currencies, $decimals], set) => {
	if (!$user) return;
	if (!$currencies) return;
	if (!$decimals) return;

	let _balances = {}

	for (const currency of $currencies) {
		getBalance(currency).then((result) => {
			console.log('original value:', new BN(result.substring(2), 16).toString());
			console.log('decimals:', $decimals[currency.address].toString());

			_balances[currency.address] = new BN(result.substring(2), 16); //.div($decimals[currency.address]).toString();

			if (Object.keys(_balances).length == $currencies.length) {
				console.log('balances###:', _balances);
				set(_balances);
			}
		}).catch((error) => {
			console.error('Ethereum Provider error', currency, error);
		});
	}
});

export const allowances = derived([user, currencies, decimals], ([$user, $currencies, $decimals], set) => {
	if (!$user) return;
	if (!$currencies) return;
	if (!$decimals) return;

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

export const accounts = derived([currencies, balances, allowances, symbols], ([$currencies, $balances, $allowances, $symbols], set) => {
	console.log('$currencies:', $currencies);
	console.log('$balances:', $balances);
	console.log('$allowances:', $allowances);
	console.log('$symbols:', $symbols);

	const createAccount = (currency) => ({
		currency: ($symbols || {[currency.address]: currency.address.substring(0,8)})[currency.address],
		address: currency.address,
		balance: ($balances || {})[currency.address],
		allowance: ($allowances || {})[currency.address]
	});

	let accounts = $currencies.map(createAccount);
	console.log('accounts:', accounts);
	set(accounts);
});
