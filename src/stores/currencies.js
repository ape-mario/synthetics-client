import { derived } from 'svelte/store'
import { chainId } from './network'
import getSymbol from '../lib/eth/getSymbol'
import getDecimals from '../lib/eth/getDecimals'
import getCurrencies from '../lib/eth/getCurrencies'
import { DEFAULT_DECIMALS } from '../lib/constants'

export const currencies = derived([chainId], async ([$chainId], set) => {
	if (!$chainId) return;

	getCurrencies().then((_currencies) => {
		set(_currencies.map(address => ({ address })));
	}).catch((error) => {
		console.error('Ethereum Provider error', error);
	});
});

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