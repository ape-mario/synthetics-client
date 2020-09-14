import { get } from 'svelte/store'
import { addresses, decimals } from '../stores/currencies.js'

export function getCurrencyAddress(params) {
	const { currency } = params;
	return (get(addresses) || {})[currency];
}

export function getCurrencyDecimals(params) {
	const { currency } = params;
	const address = getCurrencyAddress(params);
	return (get(decimals) || {})[address];
}
