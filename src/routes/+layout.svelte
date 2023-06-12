<script>
	import '../app.css';
	import LogoWhite from '../lib/assets/logo-white.svelte';
	import Logo from '../lib/assets/logo.svelte';
</script>

<!-- tailwind landing page layout -->
<div class="flex flex-col min-h-screen">
	<div class="flex flex-row justify-between items-center bg-white px-8 py-4">
		<!-- header -->
		<div class="flex-grow">
			<a href="/">
				<div class="flex flex-row items-center">
					<Logo />
					<span class="text-3xl font-bold text-gray-800 ml-4" style="font-family: 'Anybody', sans-serif;"
						>ForeBalance</span
					>
				</div>
			</a>
		</div>

		<!-- nav (About, pricing, FAQ) -->
		<div class="flex justify-center">
			<a href="/about" class="text-gray-600 hover:text-gray-800 mr-4">About</a>
			<a href="/pricing" class="text-gray-600 hover:text-gray-800 mr-4">Pricing</a>
			<a href="/faq" class="text-gray-600 hover:text-gray-800">FAQ</a>
		</div>

		<!-- button primary signup -->
		<div class="flex flex-row ml-8">
			<a
				href="/signup"
				class="bg-violet-700 hover:bg-violet-800 text-white font-bold py-2 px-4 rounded mr-3"
				>Sign up</a
			>
			<a
				href="/login"
				class="bg-transparent text-violet-700 hover:text-violet-800 font-semibold py-2 px-4"
				>Login</a
			>
		</div>
	</div>
	<slot />
	<!-- dark footer -->
	<div class="flex flex-row justify-between items-center bg-gray-800 px-8 py-4">
		<div class="flex-grow">
			<a href="/">
				<LogoWhite />
			</a>
		</div>
		<div class="flex flex-row">
			<a href="/about" class="text-gray-600 hover:text-gray-400 mr-4">About</a>
			<a href="/pricing" class="text-gray-600 hover:text-gray-400 mr-4">Pricing</a>
			<a href="/faq" class="text-gray-600 hover:text-gray-400">FAQ</a>
		</div>
	</div>
</div>
