<script lang="ts">
	import { firebaseFirestore } from '$lib/firebase';
	import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
	import AddRecord from './add-record.svelte';

	import { onDestroy } from 'svelte';
	import Balance from './balance.svelte';
	import { authStore } from '$lib/authStore';
	import { Spinner } from 'flowbite-svelte';

	let allRecords: any[] = [];
	const queryRecords = query(
		collection(firebaseFirestore, 'records'),
		orderBy('createdAt', 'desc'),
		limit(10)
	);
	const unsubscribe = onSnapshot(queryRecords, (querySnapshot) => {
		const records: any[] = [];
		querySnapshot.forEach((doc) => {
			records.push({ id: doc.id, ...doc.data() });
		});
		console.log(records);
		allRecords = records;
	});

	onDestroy(() => {
		unsubscribe();
	});
</script>

{#if !$authStore}
	<!-- loading -->
	<div class="flex flex-col items-center justify-center h-screen">
		<div class="flex flex-col items-center justify-center">
			<img src="/images/logo.svg" class="h-12" alt="Flowbite Logo" />
			<span
				class="text-2xl font-bold text-gray-800 ml-4"
				style="font-family: 'Anybody', sans-serif;">ForeBalance</span
			>
		</div>
		<div class="mt-8">
			<Spinner />
		</div>
	</div>
{/if}

{#if $authStore}
	<AddRecord />
	<Balance />
{/if}
<!-- Row for each record -->
