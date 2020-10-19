<script>

	export let _type = 'number';
	export let value;
	export let placeholder;
	export let disabled = false;
	export let element;

</script>

<style>
	input {
		background-color: #000;
		width: 100%;
		font-size: 20px;
		padding: 0 8px;
		height: 52px;
		outline: none;
		border: 1px solid rgb(118,118,118);
		border-radius: 3px;
	}
	input:focus {
		border-color: var(--color-dark-green);
		box-shadow: inset 0 0 0 1px var(--color-dark-green);
	}
</style>

{#if _type == 'number'}
<input bind:this={element} type='text' inputmode='numeric' pattern='\d+(?:\.\d*)?' {disabled} required autofocus placeholder={placeholder || ''} bind:value={value}>
{:else}
<input bind:this={element} type='text' {disabled} required autofocus placeholder={placeholder || ''} bind:value={value}>
{/if}