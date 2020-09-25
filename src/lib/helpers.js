import { get } from 'svelte/store'
import { addresses, decimals } from '../stores/currencies.js'
import { DEFAULT_DECIMALS } from './constants.js'

export function getCurrencyAddress(params) {
	const { currency } = params;
	return (get(addresses) || {})[currency];
}

export function getCurrencyDecimals(params) {
	const { currency } = params;
	const address = getCurrencyAddress(params);
	return (get(decimals) || {})[address] || DEFAULT_DECIMALS;
}

export function async_timeout(duration) {
	return new Promise((resolve) => {
		setTimeout(() => { resolve() }, duration);
	})
}