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
	.logo img {
		height: 28px;
		margin-top: 1px;
	}
</style>

<header>
	<div class='logo'>
		<a href='/'><img alt='Cap Logo' src='/assets/logo-pure.svg' /></a>
	</div>
	<div class='wallet'>
		<Wallet/>
	</div>
</header>
