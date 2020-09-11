<script>

	// Center top toast
	import { toastMessage, toastType, closeToast } from '../stores/toasts.js'

</script>

<style>
	.toast {
		padding: 10px;
		border-radius: 2px;
		display: flex;
		justify-content: space-between;
		position: fixed;
		top: var(--base-padding);
		left: 0;
		right: 0;
		z-index: 300;
		max-width: calc(var(--container-width) - var(--base-padding) * 2);
		margin: 0 auto;
	}
	.toast.error {
		background-color: #f9edbe;
		border: 1px solid #f0c36d;
		color: #3b382d;
	}
	.toast.success {
		background-color: #DAF9D4;
		border: 1px solid #88DA81;
		color: #2A5D1A;
	}
	.close {
		width: 20%;
		display: flex;
		justify-content: flex-end;
		cursor: pointer;
		text-decoration: underline
	}
	
</style>

{#if $toastMessage}
<div class={'toast ' + $toastType}>
	<span>{$toastMessage}</span>
	<span class='close' on:click={closeToast}>close</span>
</div>
{/if}