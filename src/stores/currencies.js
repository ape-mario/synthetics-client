import { readable, writable, get, derived } from 'svelte/store'
import getSymbol from '../lib/eth/getSymbol.js'
import getDecimals from '../lib/eth/getDecimals.js'
import { DEFAULT_DECIMALS } from '../lib/constants.js'

export const lastFetched = writable(0);

export const currencies = writable([]);

export const decimals = derived([currencies], async ([$currencies], set) => {
	if (!$currencies) return;

	const results = await Promise.allSettled($currencies.map(getDecimals));
	const _decimals = results.map((r, i) => ({[$currencies[i].address]: (r.value || DEFAULT_DECIMALS)}));
	set(Object.assign({}, ..._decimals));
});

export const symbols = derived([currencies], async ([$currencies], set) => {
	if (!$currencies) return;

	const results = await Promise.allSettled($currencies.map(getSymbol));
	const _symbols = results.map((r, i) => ({[$currencies[i].address]: (r.value || 'N/A')}));
	set(Object.assign({}, ..._symbols));
});

export const addresses = derived(symbols, ($symbols) => Object.assign({}, ...Object.keys($symbols || []).map(k => ({[$symbols[k]]: k}))));