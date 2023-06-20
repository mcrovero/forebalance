<script lang="ts">
	import { signOut } from '@auth/sveltekit/client';

	import {
		Avatar,
		Button,
		Dropdown,
		DropdownItem,
		NavBrand,
		NavHamburger,
		Navbar
	} from 'flowbite-svelte';
	import Star from 'svelte-material-icons/Star.svelte';
	import '../../app.css';

	export let data;
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
		<div class="flex md:order-2 ml-auto space-x-4">
			{#if data.user.premium !== 'premium'}
				<Button href="/pricing" size="sm" color="primary" outline={true}>
					<Star class="w-5 h-5 mr-2" />
					Upgrade
				</Button>
			{/if}

			<!-- if user is logged in, show avatar and dropdown menu -->
			<Avatar id="avatar-menu" src={data.user.image ?? ''} />
			<Dropdown placement="bottom" triggeredBy="#avatar-menu">
				<DropdownItem on:click={signOut}>Sign out</DropdownItem>
			</Dropdown>
		</div>
	</Navbar>
	<div class="container mx-auto px-4">
		<slot />
	</div>
</div>
