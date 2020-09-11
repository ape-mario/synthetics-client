import { get } from 'svelte/store'
import { currencies, lastFetched } from '../../stores/currencies.js'
import getCurrencies from '../eth/getCurrencies.js'

export default function updateCurrencies() {
	if (get(lastFetched) > Date.now() - 30 * 60 * 1000) return;

	getCurrencies().then((_currencies) => {
		currencies.set(_currencies.map(address => ({ address })));
		lastFetched.set(Date.now());
	}).catch((error) => {
		console.error('Ethereum Provider error', error);
	});
}