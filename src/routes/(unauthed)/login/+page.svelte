<!-- src/routes/login/+page.svelte -->

<script lang="ts">
	let email: string;
	
	import { signIn } from '@auth/sveltekit/client';
	import { page } from '$app/stores';
</script>

{$page.data.session}

<form
	class="flex flex-col gap-4 p-8 space-y-4 bg-white sm:w-10/12"
	on:submit|preventDefault={() => signIn('email', { email })}
>
	<input
		type="email"
		placeholder="Email"
		class="px-4 py-2 border border-gray-300 rounded-md"
		required
		bind:value={email}
	/>

	<button type="submit" class="default-action">Login</button>
</form>

<button class="default-action" on:click={() => signIn('google')}> Login with Google </button>
