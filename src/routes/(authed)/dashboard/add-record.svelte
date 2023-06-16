<script>
	import { Button, Input, Label, Modal, Spinner } from 'flowbite-svelte';

	let formModal = false;
	let income = true;
	let name = '';
	let amount = 0;
	let date = new Date();
	let repeat = 'never';
	let times = 0;

	let loading = false;

	async function addRecord() {
		loading = true;
		const record = {
			name,
			amount,
			date,
			repeat,
			times,
			arrived: false,
			visible: true,
			income,
			createdAt: new Date(),
			updatedAt: new Date()
		};

		// TODO: add record to db
		loading = false;
		// close modal
		formModal = false;
	}
</script>

<Button on:click={() => (formModal = true)}>
	<svg class="w-5 h-5 mr-2 -ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M12 6v6m0 0v6m0-6h6m-6 0H6"
		/>
	</svg>
	Add record
</Button>

<Modal bind:open={formModal} size="xs" autoclose={false} class="w-full">
	<form class="flex flex-col space-y-6 items-stretch">
		<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Add record</h3>
		<!-- 2 buttons on the same row occupying full width -->
		<div class="flex flex-row justify-center space-x-2">
			<Button
				class="w-full"
				color="blue"
				outline={!income}
				on:click={() => {
					income = true;
				}}
			>
				Income
			</Button>
			<Button
				class="w-full"
				outline={income}
				color="red"
				on:click={() => {
					income = false;
				}}
			>
				Expense
			</Button>
		</div>
		<Label class="space-y-2">
			<span>What will you pay?</span>
			<Input type="text" name="name" placeholder="Car, Taxes, etc" required bind:value={name} />
		</Label>
		<div class="flex flex-row justify-stretch space-x-2">
			<Label class="space-y-2">
				<span>How much? </span>
				<Input type="number" name="amount" placeholder="1000" required bind:value={amount} />
			</Label>
			<Label class="space-y-2">
				<span>When? </span>
				<Input type="date" name="date" placeholder="1000" required bind:value={date} />
			</Label>
		</div>
		<!-- Select repeat (never, daily, weekly, monthly, yearly) and times -->
		<div class="flex flex-row justify-stretch space-x-2">
			<Label class="space-y-2">
				<span>Repeat? </span>
				<select name="repeat" class="w-full" bind:value={repeat}>
					<option value="never">Never</option>
					<option value="daily">Daily</option>
					<option value="weekly">Weekly</option>
					<option value="monthly">Monthly</option>
					<option value="yearly">Yearly</option>
				</select>
			</Label>
			<Label class="space-y-2">
				<span>Times? </span>
				<Input type="number" name="times" placeholder="0" required bind:value={times} />
			</Label>
		</div>
		<!-- submit -->
		<div class="flex flex-row justify-center space-x-2">
			<Button class="w-full" on:click={addRecord} disabled={loading}>
				{#if loading}
					<Spinner class="mr-3" size="4" color="white" />
				{/if}
				Add</Button
			>
		</div>
	</form>
</Modal>
