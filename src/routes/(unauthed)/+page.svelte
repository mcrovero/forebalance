<script>
	import { Accordion, AccordionItem, Button, Card } from 'flowbite-svelte';
</script>

<!-- landing page first block, 2 columns one with Title, description and CTA and one column with the app screen -->
<div class="flex flex-col">
	<div class="flex flex-col md:flex-row">
		<!-- padding top bottom if in desktop -->
		<div class="flex flex-col md:w-1/2 md:pt-32">
			<h1 class="text-5xl font-bold leading-tight text-gray-800 dark:text-gray-100">
				Achieve Financial peace of mind with ForeBalance
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
			<img class="w-full h-auto" src="/images/landing-page/landing-page-1.png" alt="ForeBalance" />
		</div>
	</div>
	<hr class="my-12 h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />
	<!-- second block, 3 cards with icons, title and description -->
	<div class="flex flex-col md:flex-row">
		<Card class="flex flex-col items-center justify-center p-6 mb-4 md:mb-0 md:mr-4">
			<img class="w-16 h-16 mb-4" src="/icons/track.svg" alt="ForeBalance" />
			<h3 class="text-xl font-bold leading-tight text-gray-800 dark:text-gray-100">
				Intelligent expense tracking
			</h3>
			<p class="mt-4 text-gray-500 dark:text-gray-400">
				Easily input and categorize your expenses, and let ForeBalance do the rest. With smart
				algorithms and automated data analysis, you'll gain valuable insights into your spending
				habits, helping you make informed decisions and stay on top of your financial game.
			</p>
		</Card>
		<Card class="flex flex-col items-center justify-center p-6 mb-4 md:mb-0 md:mr-4">
			<img class="w-16 h-16 mb-4" src="/icons/graph.svg" alt="ForeBalance" />
			<h3 class="text-xl font-bold leading-tight text-gray-800 dark:text-gray-100">
				Smart budgeting
			</h3>
			<p class="mt-4 text-gray-500 dark:text-gray-400">
				Set up your budget and let ForeBalance do the rest. With smart algorithms and automated data
				analysis, you'll gain valuable insights into your spending habits, helping you make informed
				decisions and stay on top of your financial game.
			</p>
		</Card>
		<Card class="flex flex-col items-center justify-center p-6 mb-4 md:mb-0">
			<img class="w-16 h-16 mb-4" src="/icons/time.svg" alt="ForeBalance" />
			<h3 class="text-xl font-bold leading-tight text-gray-800 dark:text-gray-100">
				Powerful reporting
			</h3>
			<p class="mt-4 text-gray-500 dark:text-gray-400">
				Set up your budget and let ForeBalance do the rest. With smart algorithms and automated data
				analysis, you'll gain valuable insights into your spending habits, helping you make informed
				decisions and stay on top of your financial game.
			</p>
		</Card>
	</div>

	<!-- third block, 2 columns one with the app screen and one with title, description and CTA -->
	<div
		style="background-color: #F6F6F6;"
		class="flex flex-col md:flex-row mt-12 rounded-lg p-10 gap-10 items-center"
	>
		<div class="flex items-center justify-center mt-6 md:mt-0 md:w-1/2">
			<img class="w-full h-auto m-20" src="/images/graph.svg" alt="ForeBalance" />
		</div>
		<div class="flex flex-col md:w-1/2">
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
					<p>
						Yes. ForeBalance uses bank-level security to ensure that your data is safe and secure.
						We use 256-bit SSL encryption and read-only access to your financial accounts. We never
						store your bank credentials, and we never share your personal information with third
						parties.
					</p>
				</AccordionItem>
				<AccordionItem>
					<span slot="header">Can ForeBalance handle recurring expenses and income?</span>
					<p>
						Yes. ForeBalance can handle recurring expenses and income. You can set up recurring
						transactions to automatically repeat at a specified interval. You can also set up
						recurring transfers between accounts.
					</p>
				</AccordionItem>
				<AccordionItem>
					<span slot="header">Can I use ForeBalance to manage my business finances?</span>
					<p>
						Yes. ForeBalance can be used to manage your business finances. You can set up multiple
						accounts for your business, and you can set up recurring transactions to automatically
						repeat at a specified interval. You can also set up recurring transfers between
						accounts.
					</p>
				</AccordionItem>
				<AccordionItem>
					<span slot="header">Does ForeBalance offer mobile apps?</span>
					<p>
						Yes. ForeBalance offers mobile apps for iOS and Android. You can download the iOS app
						from the App Store, and you can download the Android app from the Google Play Store.
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
