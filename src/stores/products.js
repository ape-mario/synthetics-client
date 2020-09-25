import { writable, derived } from 'svelte/store'
import { user } from './user'
import { chainId } from './network'
import { transactions, recentEvents } from './transactions'
import getMaxAmount from '../lib/eth/getMaxAmount'
import getProducts from '../lib/eth/getProducts'
import getProductBalance from '../lib/eth/getProductBalance'
import getProductAddress from '../lib/eth/getProductAddress'

export const products = derived([chainId], async ([$chainId], set) => {
	if (!$chainId) return;

	getProducts().then((_products) => {
		set(_products.map(product => ({ product })));
	}).catch((error) => {
		console.error('Ethereum Provider error', error);
	});
});

let defaultAccount = JSON.parse(localStorage.getItem('selected-product') || null) || {product: 'AAPL'};
export const selectedProduct = writable(defaultAccount);

selectedProduct.setPersist = (obj) => {
	localStorage.setItem('selected-product', JSON.stringify(obj));
	selectedProduct.set(obj);
}

export const selectedSide = writable('buy');

export const selectedProductMaxAmount = derived([chainId, selectedProduct], async ([$chainId, $selectedProduct], set) => {
	if (!$chainId) return;
	if (!$selectedProduct) return;

	const maxAmount = await getMaxAmount($selectedProduct);
	set(maxAmount);
});

export const selectedProductBalance = derived([chainId, selectedProduct, user, transactions, recentEvents], async ([$chainId, $selectedProduct, $user, $transactions, $recentEvents], set) => {
	if (!$chainId) return;
	if (!$selectedProduct) return;
	if (!$user) return;

	const balance = await getProductBalance($selectedProduct);
	set(balance);
});

export const selectedProductAddress = derived([chainId, selectedProduct], async ([$chainId, $selectedProduct], set) => {
	if (!$chainId) return;
	if (!$selectedProduct) return;

	const address = await getProductAddress($selectedProduct);
	set(address);
});
