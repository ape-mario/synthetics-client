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
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	footer a {
		color: var(--color-green);
	}
</style>

<footer>
	<span>Cap (Ropsten testnet)</span>
	<span>
		<a href='https://t.me/capfin' target='_blank'>Telegram</a>, <a href='https://blog.cap.finance' target='_blank'>Blog</a>, <a href='https://twitter.com/CapDotFinance' target='_blank'>Twitter</a>
	</span>
</footer>
