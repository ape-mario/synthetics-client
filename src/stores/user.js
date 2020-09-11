import { readable, writable, derived } from 'svelte/store'

// writable
export const user = writable(null);

// derived
export const minified_user = derived(user, ($user) => {
	return $user ? $user.substring(0,6) + "..." + $user.slice(-4) : null;
});
