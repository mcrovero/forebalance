<script lang="ts">
	import { authStore } from '$lib/authStore';
	import { firebaseAuth, firebaseFirestore } from '$lib/firebase';
	import {
		addDoc,
		collection,
		getDocs,
		onSnapshot,
		query,
		updateDoc,
		where
	} from 'firebase/firestore';
	import { onDestroy, onMount } from 'svelte';

	let balance = 0;
	let editing = false;
	let loading = false;
	// get user data from firestore
	// get from collection users, where uid = current user
	onMount(() => {
		const user = $authStore;
		console.log(user);
		const queryUser = query(
			collection(firebaseFirestore, 'users'),
			where('id', '==', user?.uid || '')
		);
		onSnapshot(queryUser, (querySnapshot) => {
			if (querySnapshot.empty) {
				console.log('No matching documents.');
				return;
			}
			balance = querySnapshot.docs[0].data()?.balance;
		});
	});

	async function updateBalance() {
		loading = true;
		// Update balance in firestore
		const user = await firebaseAuth.currentUser;
		console.log(user);
		const userRef = collection(firebaseFirestore, 'users');
		const queryUser = query(userRef, where('id', '==', user?.uid || ''));
		const querySnapshot = await getDocs(queryUser);
		let docRef;
		if (querySnapshot.empty) {
			// create new user
			docRef = await addDoc(collection(firebaseFirestore, 'users'), {
				id: user?.uid,
				balance: balance
			});
		} else {
			// update existing user
			const doc = querySnapshot.docs[0];
			docRef = await updateDoc(doc.ref, {
				balance: balance
			});
		}
		console.log('Document updated with ID: ', docRef);
		editing = false;
		loading = false;
	}
</script>

<!-- Widget that shows user current balance, with an edit icon that makes it a textfield -->
<div class="flex flex-row items-center space-x-2">
	{#if editing}
		<input
			type="number"
			class="w-full text-2xl font-bold text-gray-900 dark:text-white"
			on:keydown={(e) => {
				if (e.key === 'Enter') {
					updateBalance();
				}
			}}
			bind:value={balance}
			disabled={loading}
		/>
	{:else}
		<span class="text-2xl font-bold text-gray-900 dark:text-white">
			{balance}
		</span>
	{/if}
	<span on:click={() => (editing = !editing)}>edit</span>
</div>
