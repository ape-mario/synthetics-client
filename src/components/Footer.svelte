<script>
	import Wallet from './Wallet.svelte'
</script>

<style>
	footer {
		position:absolute;
		bottom:0;
		width:100%;
		text-align: center;
		padding: 15px 0;
		/* display: flex; */
		justify-content: space-between;
		align-items: center;
	}
	footer a {
		color: var(--color-green);
	}

	.network-type{
		margin-left:25px;
		text-align:left;
		font-size:1rem;
	}

	.external-links {
		margin-right:25px;
		text-align:right;
		font-size:1rem;
	}

</style>

<footer>
	<!-- <span class="network-type">Cap (Ropsten testnet)</span> -->
	<span class="external-links" style="text-align:center;">
		<a href='https://gov.cap.uly.dev/' target='_blank'>Governance</a> | <a href='https://t.me/capfin' target='_blank'>Telegram</a> | <a href='https://blog.cap.finance' target='_blank'>Blog</a> | <a href='https://twitter.com/CapDotFinance' target='_blank'>Twitter</a>
	</span>
</footer>
