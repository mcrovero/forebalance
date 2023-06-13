<script lang="ts">
	// Check if firebase is authenticated, if not, redirect to login page
	import { goto } from '$app/navigation';
	import { firebaseAuth } from '$lib/firebase';
	import { onDestroy, onMount } from 'svelte';

	import { Avatar, Dropdown, DropdownItem, NavBrand, NavHamburger, Navbar } from 'flowbite-svelte';
	import '../../app.css';
	import { authStore } from '$lib/authStore';

	onMount(() => {
		console.log('onMount');
		firebaseAuth.onAuthStateChanged((user) => {
			$authStore = user;
			console.log(user);
			if (!user) {
				goto('/login');
			}
		});
	});

	let signOut = () => {
		firebaseAuth.signOut().catch((error) => {
			console.log(error);
		});
	};
</script>

<div class="flex flex-col min-h-screen">
	<Navbar let:hidden let:toggle>
		<NavBrand href="/">
			<img src="/images/logo.svg" class="mr-3 h-12" alt="Flowbite Logo" />
			<span
				class="text-2xl font-bold text-gray-800 ml-4"
				style="font-family: 'Anybody', sans-serif;">ForeBalance</span
			>
		</NavBrand>
		<div class="flex md:order-2">
			<!-- if user is logged in, show avatar and dropdown menu -->
			{#if $authStore}
				<Avatar id="avatar-menu" src={$authStore?.photoURL ?? ''} />
				<Dropdown placement="bottom" triggeredBy="#avatar-menu">
					<DropdownItem on:click={signOut}>Sign out</DropdownItem>
				</Dropdown>
			{/if}
			<NavHamburger on:click={toggle} class1="w-full md:flex md:w-auto md:order-1" />
		</div>
		<Dropdown placement="bottom" triggeredBy="#avatar-menu">
			<DropdownItem on:click={signOut}>Sign out</DropdownItem>
		</Dropdown>
	</Navbar>
	<div class="container mx-auto px-4">
		<slot />
	</div>
</div>
