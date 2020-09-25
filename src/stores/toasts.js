import { writable } from 'svelte/store'

// writable
export const toastMessage = writable(null);
export const toastType = writable(null);

export function showToast(message, type) {
	if (!type) type = 'error';
	toastType.set(type);
	toastMessage.set(message);
}

export function closeToast() {
	toastMessage.set(null);
	toastType.set(null);
}