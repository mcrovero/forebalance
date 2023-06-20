<script>
	import { Accordion, AccordionItem, Button, Card, DeviceMockup } from 'flowbite-svelte';
</script>

<!-- landing page first block, 2 columns one with Title, description and CTA and one column with the app screen -->
<div class="flex flex-col">
	<div class="flex flex-col md:flex-row">
		<!-- padding top bottom if in desktop -->
		<div class="flex flex-col md:w-1/2 md:pt-32">
			<h1 class="text-5xl font-bold leading-tight text-gray-800 dark:text-gray-100">
				Achieve financial peace of mind with ForeBalance
			</h1>
			<p class="mt-4 text-gray-500 dark:text-gray-400">
				The ultimate financial management solution designed to empower individuals and businesses to
				achieve financial stability
			</p>
			<div class="flex mt-6">
				<Button size="xl" class="mr-2" href="/dashboard">Get started</Button>
				<span
					class="inline-flex items-center justify-center px-5 py-3 text-base font-medium leading-6 text-gray-500 transition duration-150 ease-in-out bg-white border border-transparent rounded-md hover:text-gray-400 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-500 active:bg-gray-50"
				>
					+1 Happy Customer
				</span>
			</div>
		</div>
		<div class="flex items-center justify-center mt-6 md:mt-0 md:w-1/2">
			<img class="w-full h-auto" src="/images/landing-page/landing1.png" alt="ForeBalance" />
		</div>
	</div>
	<hr class="my-12 h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />
	<!-- second block, 3 cards with icons, title and description -->
	<div class="flex flex-col md:flex-row items-center">
		<Card class="flex flex-col items-center justify-center p-6 mb-4 md:mb-0 md:mr-4">
			<img class="w-16 h-16 mb-4" src="/icons/track.svg" alt="ForeBalance" />
			<h3 class="text-xl font-bold leading-tight text-gray-800 dark:text-gray-100">
				Visualize Your Financial Future
			</h3>
			<p class="mt-4 text-gray-500 dark:text-gray-400">
				See your financial future at a glance with Forebalance. Plot your income, payments, and
				projections on an interactive graph.
			</p>
		</Card>
		<Card class="flex flex-col items-center justify-center p-6 mb-4 md:mb-0 md:mr-4">
			<img class="w-16 h-16 mb-4" src="/icons/graph.svg" alt="ForeBalance" />
			<h3 class="text-xl font-bold leading-tight text-gray-800 dark:text-gray-100">
				Streamline Recurring Payments
			</h3>
			<p class="mt-4 text-gray-500 dark:text-gray-400">
				Simplify your life with Forebalance. Effortlessly manage and track recurring payments for
				bills, rent, and subscriptions.
			</p>
		</Card>
		<Card class="flex flex-col items-center justify-center p-6 mb-4 md:mb-0">
			<img class="w-16 h-16 mb-4" src="/icons/time.svg" alt="ForeBalance" />
			<h3 class="text-xl font-bold leading-tight text-gray-800 dark:text-gray-100">
				Track and Analyze Your Financial History
			</h3>
			<p class="mt-4 text-gray-500 dark:text-gray-400">
				Gain insights from your past records with Forebalance. Track transactions and spending
				patterns to make better financial decisions.
			</p>
		</Card>
	</div>

	<!-- third block, 2 columns one with the app screen and one with title, description and CTA -->
	<div
		style="background-color: #F6F6F6;"
		class="flex flex-col lg:flex-row mt-12 rounded-lg p-10 gap-10 items-center lg:items-stretch justify-center"
	>
		<div class="mt-8">
			<DeviceMockup device="laptop">
				<img
					src="images/landing-page/landing2.png"
					class="dark:hidden h-[156px] md:h-[278px] w-full rounded-xl"
					alt="laptop example 1"
				/>
			</DeviceMockup>
		</div>
		<div class="flex flex-col w-full lg:w-1/2">
			<h1 class="text-4xl font-bold leading-tight text-gray-800 dark:text-gray-100">
				Unlock Financial Success: Project Your Future Finances and Take Control Today
			</h1>
			<p class="mt-4 text-gray-500 dark:text-gray-400">
				While many competitors solely focus on current balance and transaction tracking, ForeBalance
				sets itself apart by emphasizing future financial planning. We understand that financial
				stability goes beyond the present moment. With ForeBalance, you can project your financial
				health into the future, enabling you to make proactive decisions, avoid potential pitfalls,
				and achieve long-term solvency.
			</p>
		</div>
	</div>

	<!-- fourth block, FAQ with Accordion -->
	<div class="flex flex-col mt-12 md:w-1/2 md:mx-auto">
		<h1 class="text-4xl font-bold leading-tight text-gray-800 dark:text-gray-100">FAQs</h1>
		<span class="text-gray-500 dark:text-gray-400">Frequently asked questions</span>
		<div class="flex flex-col mt-6">
			<Accordion>
				<AccordionItem>
					<span slot="header">Is my financial data safe with ForeBalance?</span>
					<p>Yes.</p>
				</AccordionItem>
				<AccordionItem>
					<span slot="header">Can ForeBalance handle recurring expenses and income?</span>
					<p>
						Yes. ForeBalance can handle recurring expenses and income. You can set up recurring
						transactions to automatically repeat at a specified interval.
					</p>
				</AccordionItem>
				<AccordionItem>
					<span slot="header">Can I use ForeBalance to manage my business finances?</span>
					<p>
						Yes. ForeBalance can be used to manage your business finances. You can set up multiple
						accounts for your business, and you can set up recurring transactions to automatically
						repeat at a specified interval.
					</p>
				</AccordionItem>
				<AccordionItem>
					<span slot="header">Does ForeBalance offer mobile apps?</span>
					<p>
						We are working on mobile apps for iOS and Android. We will notify you when they are
						available.
					</p>
				</AccordionItem>
			</Accordion>
		</div>
	</div>

	<hr class="my-12 h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />

	<!-- fifth block, Single column with over title, big title and cta -->
	<div class="flex flex-col mt-12 md:w-2/3 md:mx-auto justify-center items-center mb-12">
		<span class="text-gray-500 dark:text-gray-400">Join ForeBalance</span>
		<h1 class="text-6xl font-bold leading-tight text-gray-800 dark:text-gray-100">
			Plan. Track. Prosper.
		</h1>
		<div class="flex flex-col mt-6">
			<Button size="xl" class="mr-2" href="/dashboard">Start now</Button>
		</div>
	</div>
</div>
