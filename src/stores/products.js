import { readable, writable, derived, get } from 'svelte/store'
import { user } from './user.js'
import { transactions, recentEvents } from './transactions.js'
import { CONTRACTS, UNIT } from '../lib/constants.js'
import getMaxAmount from '../lib/eth/getMaxAmount.js'
import getProductBalance from '../lib/eth/getProductBalance.js'
import getProductAddress from '../lib/eth/getProductAddress.js'

export const products = writable([]);
export const lastFetched = writable(0);

let defaultAccount = JSON.parse(localStorage.getItem('selected-product') || null) || {product: 'BTC'};
export const selectedProduct = writable(defaultAccount);

selectedProduct.setPersist = (obj) => {
	localStorage.setItem('selected-product', JSON.stringify(obj));
	selectedProduct.set(obj);
}

export const selectedSide = writable('buy');

export const selectedProductMaxAmount = derived([selectedProduct], async ([$selectedProduct], set) => {
	if (!$selectedProduct) return;

	const maxAmount = getMaxAmount($selectedProduct);
	set(maxAmount);
});

export const selectedProductBalance = derived([selectedProduct, user, transactions, recentEvents], async ([$selectedProduct, $user, $transactions, $recentEvents], set) => {
	if (!$selectedProduct) return;
	if (!$user) return;

	const balance = await getProductBalance($selectedProduct);
	set(balance);
});

export const selectedProductAddress = derived([selectedProduct], async ([$selectedProduct], set) => {
	if (!$selectedProduct) return;

	const address = await getProductAddress($selectedProduct);
	set(address);
});
