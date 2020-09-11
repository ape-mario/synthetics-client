import { get } from 'svelte/store'
import { products, lastFetched } from '../../stores/products.js'
import getProducts from '../eth/getProducts.js'

export default function updateProducts() {
	if (get(lastFetched) > Date.now() - 30 * 60 * 1000) return;

	getProducts(0, 0).then((_products) => {
		products.set(_products.map(product => ({ product })));
		lastFetched.set(Date.now());
	}).catch((error) => {
		console.error('Ethereum Provider error', error);
	});
}
