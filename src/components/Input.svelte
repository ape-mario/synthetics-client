<script>

	export let _type = 'number';
	export let value;
	export let placeholder;
	export let max = 100000000000000;
	export let min = 1;
	export let disabled = false;

</script>

<style>
	input {
		width: 100%;
		font-size: 20px;
		padding: 0 8px;
		height: 52px;
		outline: none;
		border: 1px solid rgb(118,118,118);
		border-radius: 3px;
	}
	input:focus {
		border-color: var(--color-blue);
		box-shadow: inset 0 0 0 1px var(--color-blue);
	}
</style>

{#if _type == 'number'}
<input type='number' step='0.01' {disabled} min={min} max={max} required autofocus placeholder={placeholder || ''} bind:value={value}>
{:else}
<input type='text' {disabled} required autofocus placeholder={placeholder || ''} bind:value={value}>
{/if}