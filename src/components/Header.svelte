<script>
	import Wallet from './Wallet.svelte'
</script>

<style>
	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 55px;
		border-bottom: 3px solid var(--border-color);
		position: relative;
		z-index: 12;
	}
	.logo-container {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.logo img {
		height: 28px;
		margin-top: 1px;
		margin-right: 15px;
	}
</style>

<header>
	<div class='logo-container'>
		<a class='logo' href='/'><img alt='Cap Logo' src='/assets/logo-pure.svg' /></a>
		<span><strong>Synthetics</strong></span>
	</div>
	<div class='wallet'>
		<Wallet/>
	</div>
</header>
