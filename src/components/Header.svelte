<script>
	import Wallet from './Wallet.svelte'
</script>

<style>
	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: relative;
		z-index: 12;
	}
	header > div {
		margin-bottom: 10px;
	}
	.logo-container {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		margin-left: 25px;
	}
	.logo img {
		height: 25px;
		margin-top: 1px;
		margin-right: 10px;
	}
</style>

<header class="flex flex-row mx-8 lg:mx-12 py-8 mb-12 text-white justify-between">

	<div class="flex flex-col space-y-1 items-start">
		<img src="/assets/logo-pure.svg" alt="logo" class="w-16">
		<h1 class="text-xl font-thin">SYNTHETICS</h1>
		<span class="text-white text-xs p-0 px-2 bg-green-900 mt-6 inline-block opacity-50">ROPSTEN</span>
	</div>

	<!-- <div class='logo-container'>
		<span class='logo'><img alt='Cap Logo' src='/assets/logo-pure.svg' /></span>
		<span><strong>Synthetics</strong></span>
	</div> -->
	<Wallet/>
</header>
