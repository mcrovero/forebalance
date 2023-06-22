<script>
	import {
		Button,
		Footer,
		FooterBrand,
		FooterCopyright,
		FooterLink,
		FooterLinkGroup,
		NavBrand,
		NavHamburger,
		NavLi,
		NavUl,
		Navbar
	} from 'flowbite-svelte';
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
			<NavUl class="hidden md:flex">
				<NavLi href="/pricing">Pricing</NavLi>
			</NavUl>
			<Button size="sm" href="/dashboard">Get started</Button>
			<NavHamburger on:click={toggle} />
		</div>
		<NavUl class="md:hidden" {hidden}>
			<NavLi href="/pricing">Pricing</NavLi>
		</NavUl>
	</Navbar>
	<div class="container mx-auto px-4">
		<slot />
	</div>
	<!-- footer -->
	<Footer class="rounded-lg shadow m-4 dark bg-gray-800" footerType="logo">
		<div class="sm:flex sm:items-center sm:justify-between">
			<FooterBrand
				href="https://flowbite.com"
				src="/images/logo-white.svg"
				alt="ForeBalance Logo"
				name="ForeBalance"
				style="font-family: 'Anybody', sans-serif;"
			/>
			<FooterLinkGroup
				ulClass="flex flex-wrap items-center mb-6 text-sm text-gray-500 sm:mb-0 dark:text-gray-400"
			>
				<FooterLink href="/pricing">Pricing</FooterLink>
				<FooterLink href="/contact">Contact</FooterLink>
				<FooterLink href="/tos">Terms of Service</FooterLink>
				<a
					href="https://www.iubenda.com/privacy-policy/80584291"
					class="iubenda-black iubenda-noiframe iubenda-embed iubenda-noiframe"
					title="Privacy Policy"
				>
					Privacy Policy
				</a>
				<script type="text/javascript">
					(function (w, d) {
						var loader = function () {
							var s = d.createElement('script'),
								tag = d.getElementsByTagName('script')[0];
							s.src = 'https://cdn.iubenda.com/iubenda.js';
							tag.parentNode.insertBefore(s, tag);
						};
						if (w.addEventListener) {
							w.addEventListener('load', loader, false);
						} else if (w.attachEvent) {
							w.attachEvent('onload', loader);
						} else {
							w.onload = loader;
						}
					})(window, document);
				</script>
			</FooterLinkGroup>
		</div>
		<hr class="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
		<FooterCopyright href="/" by="ForeBalance" />
	</Footer>
</div>
