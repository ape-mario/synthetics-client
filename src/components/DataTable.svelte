<script>

	export let title = null;
	export let tool = '';

</script>

<style>
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 0;
		border-bottom: 1px solid var(--border-color);
		border-top: 3px solid var(--border-color);
	}
	.table {
		margin: 0;
	}
	.table > :global(div) {
		border-bottom: 1px solid var(--border-color);
		padding: 15px 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		line-height: 1.3;
		margin: 0;
	}
	.table > :global(div:hover) {

	}
	.table > :global(div span span) {

	}
	
	.table > :global(div a) {

	}
</style>

{#if title}
<div class='header'>
	<div><strong>{title}</strong></div>
</div>
{/if}

<div class='table'>
	<slot></slot>
</div>