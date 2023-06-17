<script lang="ts">
	import { Spinner } from 'flowbite-svelte';

	export let data;
</script>

<!-- {#if !loading} -->
<!-- loading -->
<div class="flex flex-col items-center justify-center h-screen">
	<div class="flex flex-col items-center justify-center">
		<img src="/images/logo.svg" class="h-12" alt="Flowbite Logo" />
		<span class="text-2xl font-bold text-gray-800 ml-4" style="font-family: 'Anybody', sans-serif;"
			>ForeBalance</span
		>
	</div>

	<div class="mt-8">
		<Spinner />
	</div>
</div>
<!--{/if}-->
