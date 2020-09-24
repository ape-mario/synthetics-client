import { readable, writable, get } from 'svelte/store'

export const modalActive = writable(null); // {name,data}

export function showModal(name, data) {
	if (name == 'products') {
		data.title = 'Select Asset';
		window.history.replaceState('', document.title, '/#/assets');
	} else if (name == 'accounts') {
		data.title = 'Select Account';
		window.history.replaceState('', document.title, '/#/accounts');
	} else if (name == 'review-order') {
		data.title = 'Review Order';
	} 
	// console.log('setting active modal', {name, data});
	window.scrollTo(0,0);
	modalActive.set({name, data});
}

export function hideModal() {
	modalActive.set(null);
	window.scrollTo(0,0);
	window.history.replaceState('', document.title, '/');
}

