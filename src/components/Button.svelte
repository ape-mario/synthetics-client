<script>

	export let onclick;
	export let text;
	export let isloading;
	
	$: isloading ? document.documentElement.classList.add('loading') : document.documentElement.classList.remove('loading');

</script>

<style>
	button {
		width: 100%;
		height: 50px;
		font-size: 20px;
		text-transform: capitalize;
		outline: none;
		border: 1px solid rgb(118,118,118);
		border-radius: 3px;
		background: var(--color-green);
		color: var(--color-white);
	}
	button:hover {
		background: rgb(0 153 31);
	}
	button:active {
		background: rgb(209, 209, 209);
		border-color: var(--color-blue);
	}
	button.loading {
		pointer-events: none;
		opacity: 0.5;
	}
</style>

<button type='submit' class={isloading ? 'loading' : ''} on:click={onclick}>{text}</button>