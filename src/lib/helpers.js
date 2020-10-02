import { get } from 'svelte/store'
import { addresses, decimals } from '../stores/currencies'
import { DEFAULT_DECIMALS } from './constants'

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

export function bigIntComparator(a, b) {
	if (a == b) return 0;
	return BigInt(a) > BigInt(b) ? 1 : -1;
}