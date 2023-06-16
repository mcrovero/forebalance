<script lang="ts">
	import { signOut } from '@auth/sveltekit/client';

	import { Avatar, Dropdown, DropdownItem, NavBrand, NavHamburger, Navbar } from 'flowbite-svelte';
	import '../../app.css';
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
			<Avatar id="avatar-menu" src={''} />
			<Dropdown placement="bottom" triggeredBy="#avatar-menu">
				<DropdownItem on:click={signOut}>Sign out</DropdownItem>
			</Dropdown>

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
