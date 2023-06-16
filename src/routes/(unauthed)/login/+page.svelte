<!-- src/routes/login/+page.svelte -->

<script lang="ts">
	let email: string, password: string;
	let success: boolean = true;

	import { signIn } from '@auth/sveltekit/client';
</script>

<form
	class="flex flex-col gap-4 p-8 space-y-4 bg-white sm:w-10/12"
	on:submit|preventDefault={() => signIn('credentials', { email, password })}
>
	<input
		type="email"
		placeholder="Email"
		class="px-4 py-2 border border-gray-300 rounded-md"
		required
		bind:value={email}
	/>
	<input
		type="password"
		placeholder="Password"
		class="px-4 py-2 border border-gray-300 rounded-md"
		required
		bind:value={password}
	/>

	<button type="submit" class="default-action">Login</button>
</form>

<button class="default-action" on:click={() => signIn('google')}> Login with Google </button>
