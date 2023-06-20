<script lang="ts">
	import Check from 'svelte-material-icons/Check.svelte';
	import Close from 'svelte-material-icons/Close.svelte';

	export let enabled: boolean;
</script>

{#if enabled}
	<Check class="w-5 h-5 text-green-500 dark:text-green-400" />
{:else}
	<Close class="w-5 h-5 text-gray-500 dark:text-gray-400" />
{/if}
<slot />
