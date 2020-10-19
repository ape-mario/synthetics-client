<script>

	export let title = null;
	export let action = null;
	export let tool = '';
	export let separator = false;

</script>

<style>
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 0;
		/* border-bottom: 1px solid var(--border-color); */
		/* border-top: 1px solid var(--border-color); */
	}
	.header.separator {
		/* border-top: 3px solid var(--border-color); */
	}
	.header .action {
		cursor: pointer;
		text-decoration: underline;
	}
	/* .table {
		margin: 0;
	} */
	.table > :global(div) {
		/* border-bottom: 1px solid var(--border-color); */
		/* padding: 15px 0; */
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
<div class={separator ? 'header separator' : 'header'}>
	<strong>{title}</strong>
	{#if action}
		<div class='action' on:click={action.handler}>{action.name}</div>
	{/if}
</div>
{/if}

<div class='table mt-0 mb-1' style="width:100%">
	<slot></slot>
</div>