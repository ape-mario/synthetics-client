<script>
	import Wallet from './Wallet.svelte'
</script>

<style>
	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 3px solid var(--border-color);
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
		margin-right: 5px;
	}
	.logo img {
		height: 25px;
		margin-top: 1px;
		margin-right: 10px;
	}
</style>

<header>
	<div class='logo-container'>
		<span class='logo'><img alt='Cap Logo' src='/assets/logo-pure.svg' /></span>
		<span><strong>Synthetics</strong></span>
	</div>
	<Wallet/>
</header>
