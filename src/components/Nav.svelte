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
		color: #444;
		text-decoration: none;
	}
	a:hover {
		color: #000;
	}
	a.disabled {
		color: #999;
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
	<a class='has-tooltip hover-tooltip clickable' href='https://cap.finance' data-tooltip='Deposit, trade, and withdraw synthetic asset tokens in a completely decentralized manner.' tabindex='0'>Perpetuals</a>
	<a class='active has-tooltip' data-tooltip='Deposit, trade, and withdraw synthetic asset tokens in a completely decentralized manner.' tabindex='0'><strong>Synthetics</strong></a>
	<a class='disabled has-tooltip' data-tooltip='Coming soon. Fund the Cap Liquidity Pool by directly buying freshly minted CAP tokens.' tabindex='0'>Pool</a>
	<a class='disabled has-tooltip' data-tooltip='Coming soon. Stake your CAP to get weekly rewards.' tabindex='0'>Staking</a>
</nav>

