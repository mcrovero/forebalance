<script lang="ts">
	import { firebaseFirestore } from '$lib/firebase';
	import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
	import AddRecord from './add-record.svelte';

	const q = query(
		collection(firebaseFirestore, 'records'),
		orderBy('createdAt', 'desc'),
		limit(10)
	);
	const unsubscribe = onSnapshot(q, (querySnapshot) => {
		const records: any[] = [];
		querySnapshot.forEach((doc) => {
			records.push({ id: doc.id, ...doc.data() });
		});
		console.log(records);
	});
</script>

Dashboard

<AddRecord />
