<script>
	import router from 'page';

	// For Cap, not needed. Everything is on one page. But you need router to link to specific products

	import { selectedProduct } from './stores/products.js'

	import Home from './pages/Home.svelte';

	import { showModal, hideModal } from './stores/modals.js'

	let params;

	// Set up the pages to watch for
	router('/', (ctx, next) => {
		params = {};
		next();
	});
	router('/:product', (ctx, next) => {
		params = ctx.params;
		// console.log('got params', params);
		const { product } = params;
		// console.log('product:', product);
		if (product == 'accounts') {
			showModal('accounts', {});
		} else if (product == 'assets') {
			showModal('products', {});
		} else {
			selectedProduct.setPersist({product});
		}
		next();
	});

	// Set up the router to start and actively watch for changes
	router.base('/#');
	router.start();

	// more on routing with page.js, including authentication https://jackwhiting.co.uk/posts/setting-up-routing-in-svelte-with-pagejs/#
	// improving the router  https://jackwhiting.co.uk/posts/refactoring-our-router-within-svelte/

</script>

<style>
	@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;700&display=swap');
	:global(html.loading) {
		cursor: progress !important;
	}
	:global(html.loading body) {
		pointer-events: none;
	}
	:global(body) {
		background: var(--bg-color);
		font-size: 22px;
		font-family: 'IBM Plex Mono', monospace;
		color: var(--color-white);
	}
	:global(:root) {
		--color-main: red;
		--base-padding: 20px;
		--color-dark-green: #224c2d;
		--color-green: #00CF29;
		--color-blue: #0000EE;
		--color-white: #FFFFFF;
		--border-color: #c8c8c8;
		--bg-color: #000;
		--container-width: 520px;
	}
	/* add class dark to body to update theme */
	:global(.dark) {
		--color-main: blue;
	}
	:global(div) {
		margin: 15px 0;
	}
	:global(a) {
		color: var(--color-green);
		text-decoration: none;
		cursor: pointer;
		text-transform: capitalize;
	}

	:global(.clickable) {
		cursor: pointer !important;
	}

	/* tooltip */
	:global(.has-tooltip) {
		color:#7e7e7e;
		cursor: help;
		position: relative;
		outline: none;
		border-bottom: 1px dashed #999;
	}
	/* body */
	:global(.has-tooltip::before) {
	    position: absolute;
	    top: calc(100% + 5px);
	    left: 0;
	    background-color: #f1f1f0;
	    border-radius: 2px;
	    content: attr(data-tooltip);
	    padding: 2px 7px;
	    text-transform: none;
	    transition: all 0.1s ease;
	    width: 220px;
	    z-index: 100;
	    border: 1px solid #c6c6c6;
	    outline: none;
	    font-size: 11.5px;
	    line-height: 1.35;
	    color: #3E3C3F;
	    box-shadow: 0 2px 8px #ccc;
	}
	/* arrow */
	:global(.has-tooltip::after) {

	}
	/* transition begin */
	:global(.has-tooltip::before, .has-tooltip::after) {
	    opacity: 0;
	    pointer-events: none;
	}
	/* transition end */
	:global(.has-tooltip:focus::before, .has-tooltip:focus::after) {
	    opacity: 1;
	    transition: all 0.1s ease;
	    outline: none;
	}
</style>

<main>
	<Home params={params} />
</main>