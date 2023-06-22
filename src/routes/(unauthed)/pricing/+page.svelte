<script>
	import { Button } from 'flowbite-svelte';
	import Feature from './feature.svelte';
</script>

<section class="bg-white dark:bg-gray-900">
	<div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
		<div class="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
			<h2 class="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
				Designed for business teams like yours
			</h2>
			<p class="mb-5 font-light text-gray-500 sm:text-xl dark:text-gray-400">
				Here at Flowbite we focus on markets where technology, innovation, and capital can unlock
				long-term value and drive economic growth.
			</p>
		</div>
		<div class="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0">
			<!-- Pricing Card -->
			<div
				class="flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white"
			>
				<!--<h3 class="mb-4 text-2xl font-semibold">Starter</h3>-->
				<p class="font-light text-gray-500 sm:text-lg dark:text-gray-400">
					The core features you need to get started with personal finance.
				</p>
				<div class="flex justify-center items-baseline my-8">
					<span class="mr-2 text-5xl font-extrabold">Free</span>
				</div>
				<!-- List -->
				<ul role="list" class="mb-8 space-y-4 text-left">
					<li class="flex items-center space-x-3">
						<Feature enabled={true}>
							<span>Graphical Balance Tracking</span>
						</Feature>
					</li>
					<li class="flex items-center space-x-3">
						<Feature enabled={false}>
							<span>Recurring payments</span>
						</Feature>
					</li>
					<li class="flex items-center space-x-3">
						<Feature enabled={false}>
							<span>Multiple balances</span>
						</Feature>
					</li>
					<li class="flex items-center space-x-3">
						<Feature enabled={false}>
							<span>Payment history</span>
						</Feature>
					</li>
				</ul>
				<Button size="sm" href="/dashboard" outline={true}>Get started</Button>
			</div>
			<!-- Pricing Card -->
			<div
				class="flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white"
			>
				<h3 class="mb-4 text-2xl font-semibold">Starter</h3>
				<p class="font-light text-gray-500 sm:text-lg dark:text-gray-400">
					Best option for complete personal use.
				</p>
				<div class="flex justify-center items-baseline my-8">
					<span class="mr-2 text-5xl font-extrabold">$2,99</span>
					<span class="text-gray-500 dark:text-gray-400">/month</span>
				</div>
				<!-- List -->
				<ul role="list" class="mb-8 space-y-4 text-left">
					<li class="flex items-center space-x-3">
						<Feature enabled={true}>
							<span>Everything in <b>Free</b></span>
						</Feature>
					</li>
					<li class="flex items-center space-x-3">
						<Feature enabled={true}>
							<span>Recurring payments</span>
						</Feature>
					</li>
					<li class="flex items-center space-x-3">
						<Feature enabled={true}>
							<span>Payment history</span>
						</Feature>
					</li>
					<li class="flex items-center space-x-3">
						<Feature enabled={false}>
							<span>Multiple balances</span>
						</Feature>
					</li>
				</ul>
				<Button size="sm" href="/upgrade/choose/starter">Upgrade</Button>
			</div>
			<!-- Pricing Card -->
			<div
				class="flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white"
			>
				<h3 class="mb-4 text-2xl font-semibold">Advanced</h3>
				<p class="font-light text-gray-500 sm:text-lg dark:text-gray-400">
					Best option to run your business.
				</p>
				<div class="flex justify-center items-baseline my-8">
					<span class="mr-2 text-5xl font-extrabold">$9,99</span>
					<span class="text-gray-500 dark:text-gray-400">/month</span>
				</div>
				<!-- List -->
				<ul role="list" class="mb-8 space-y-4 text-left">
					<li class="flex items-center space-x-3">
						<Feature enabled={true}>
							<span>Everything in <b>Starter</b></span>
						</Feature>
					</li>
					<li class="flex items-center space-x-3">
						<Feature enabled={true}>
							<span>Multiple balances</span>
						</Feature>
					</li>
					<li class="flex items-center space-x-3">
						<Feature enabled={true}>
							<span>Advanced Reporting</span>
						</Feature>
					</li>
					<li class="flex items-center space-x-3">
						<Feature enabled={true}>
							<span>Prioritized support</span>
						</Feature>
					</li>
				</ul>
				<Button size="sm" href="/upgrade/choose/advanced">Upgrade</Button>
			</div>
		</div>
	</div>
</section>
