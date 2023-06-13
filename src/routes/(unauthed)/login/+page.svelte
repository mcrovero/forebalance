<!-- src/routes/login/+page.svelte -->

<script lang="ts">
	import { goto } from '$app/navigation';

	import { firebaseAuth } from '$lib/firebase';
	import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';

	let email: string, password: string;
	let success: boolean = true;

	const login = () => {
		signInWithEmailAndPassword(firebaseAuth, email, password)
			.then(() => {
				goto('/');
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				console.log(errorCode, errorMessage);

				success = false;
			});
	};
	const loginWithGoogle = () => {
		const provider = new GoogleAuthProvider();
		signInWithPopup(firebaseAuth, provider)
			.then((result) => {
				const credential = GoogleAuthProvider.credentialFromResult(result);
				const token = credential?.accessToken;
				const user = result.user;
				goto('/dashboard');
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				const email = error.email;
				const credential = GoogleAuthProvider.credentialFromError(error);
			});
	};
</script>

<form
	class="flex flex-col gap-4 p-8 space-y-4 bg-white sm:w-10/12"
	on:submit|preventDefault={login}
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

<button class="default-action" on:click={loginWithGoogle}> Login with Google </button>
