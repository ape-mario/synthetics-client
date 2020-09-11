import { readable, writable, get, derived } from 'svelte/store'
import getSymbol from '../lib/eth/getSymbol.js'
import getDecimals from '../lib/eth/getDecimals.js'

export const lastFetched = writable(0);

export const currencies = writable([]);

export const decimals = derived([currencies], ([$currencies], set) => {
	if (!$currencies) return;

	let _decimals = {}

	for (const currency of $currencies) {
		getDecimals(currency).then((unit) => {
			_decimals[currency.address] = unit;

			if (Object.keys(_decimals).length == $currencies.length) {
				console.log('_decimals###:', _decimals);
				set(_decimals);
			}
		}).catch((error) => {
			console.error('Ethereum Provider error', currency, error);
		});
	}
});

export const symbols = derived([currencies], ([$currencies], set) => {
	if (!$currencies) return;

	let _symbols = {}

	for (const currency of $currencies) {
		getSymbol(currency).then((symbol) => {
			_symbols[currency.address] = symbol;

			if (Object.keys(_symbols).length == $currencies.length) {
				console.log('_symbols###:', _symbols);
				set(_symbols);
			}
		}).catch((error) => {
			console.error('Ethereum Provider error', currency, error);
		});
	}
});

export const addresses = derived(symbols, ($symbols) => Object.assign({}, ...Object.keys($symbols || []).map(k => ({[$symbols[k]]: k}))));