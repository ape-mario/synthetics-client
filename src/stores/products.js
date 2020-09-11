import { readable, writable, derived, get } from 'svelte/store'
import { user } from './user'
import { CONTRACTS, UNIT } from '../lib/constants.js'
import { formatBytes32String } from '@ethersproject/strings'
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

export const selectedProductMaxAmount = derived([selectedProduct], ([$selectedProduct], set) => {
	if (!$selectedProduct) return;

	getMaxAmount($selectedProduct).then((maxAmount) => {
		set(maxAmount);
	});
});

export const selectedProductBalance = derived([selectedProduct, user], ([$selectedProduct, $user], set) => {
	if (!$selectedProduct) return;
	if (!$user) return;

	getProductBalance($selectedProduct).then((balance) => {
		set(balance);
	});
});

export const selectedProductAddress = derived([selectedProduct], ([$selectedProduct], set) => {
	if (!$selectedProduct) return;

	getProductAddress($selectedProduct).then((address) => {
		set(address);
	});
});
