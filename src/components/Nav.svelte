<script>


</script>

<style>
	nav {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 55px;
		border-bottom: 3px solid var(--border-color);
	}
	nav a {
		margin: 0 18px;
		color: #999;
		text-decoration: none;
	}
	a.active {
		color: #000;
	}
	@media (max-width: 1024px) {
	  nav a {
	    margin: 0 5px;
	  }
	}
</style>

<nav>
	<a class='has-tooltip' data-tooltip='Trade cryptos with leverage using stablecoins, directly from your Ethereum wallet.' tabindex='0'>Perpetuals</a>
	<a class='active has-tooltip' data-tooltip='Deposit, trade, and withdraw synthetic asset tokens in a completely decentralized manner.' tabindex='0'><strong>Synthetics</strong></a>
	<a class='has-tooltip' data-tooltip='Coming soon. Fund the Cap Liquidity Pool by directly buying freshly minted CAP tokens.' tabindex='0'>Pool</a>
	<a class='has-tooltip' data-tooltip='Coming soon. Stake your CAP to get weekly rewards.' tabindex='0'>Staking</a> 
</nav>

