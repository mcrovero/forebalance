<script lang="ts">
	import { fly, slide } from 'svelte/transition';

	import { enhance } from '$app/forms';
	import { Button, Checkbox, Hr, Input, Label, Modal, Select, Spinner } from 'flowbite-svelte';

	export let data;
	export let form;

	let showModal = false;
	let isExpense = false;
	let description = '';
	let amount = 0;
	let date = new Date();
	let repeat = 'never';
	let endDate: Date | null = new Date();
	let manualReceive = false;
	let noEndDate = true;

	let loading = false;

	// If repeat is never then disable endDate
	$: if (repeat === 'never' || noEndDate === true) {
		endDate = null;
	}
</script>

<Button on:click={() => (showModal = true)}>
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
<Modal bind:open={showModal} size="xs" autoclose={false} class="w-full">
	<form
		class="flex flex-col items-stretch space-y-4"
		method="POST"
		action="?/addRecord"
		use:enhance={() => {
			loading = true;
			return async ({ update }) => {
				await update();
				showModal = false;
				loading = false;
			};
		}}
	>
		<h3 class="mb-2 text-xl font-medium text-gray-900 dark:text-white">Add record</h3>
		<Hr />
		<input type="hidden" name="balanceId" value={data.balance.id} />
		<input type="hidden" name="is-expense" value={isExpense} />
		<!-- 2 buttons on the same row occupying full width -->
		<div class="flex flex-row justify-center gap-3">
			<Button
				class="w-full"
				color="blue"
				outline={isExpense}
				on:click={() => {
					isExpense = false;
				}}
			>
				Income
			</Button>
			<Button
				class="w-full"
				outline={!isExpense}
				color="red"
				on:click={() => {
					isExpense = true;
				}}
			>
				Expense
			</Button>
		</div>
		<Label class="space-y-2">
			<span>What will you pay?</span>
			<Input
				type="text"
				name="description"
				placeholder="Car, Taxes, etc"
				required
				bind:value={description}
			/>
		</Label>
		<div class="grid gap-3 mb-6 md:grid-cols-2">
			<Label class="space-y-2">
				<span>How much? </span>
				<Input type="number" name="amount" placeholder="1000" required bind:value={amount} />
			</Label>
			<Label class="space-y-2">
				<span>When? </span>
				<Input type="date" name="date" placeholder="1000" required bind:value={date} />
			</Label>
			<Label class="space-y-2">
				<span>Repeat? </span>
				<Select name="repeat" bind:value={repeat}>
					<option value="never">Never</option>
					<option value="weekly">Weekly</option>
					<option value="monthly">Monthly</option>
					<option value="yearly">Yearly</option>
				</Select>
			</Label>
			<Label class="space-y-2">
				{#if repeat !== 'never'}
					<span>Till when? </span>
					<Input
						type="date"
						name="end-date"
						placeholder="1000"
						bind:value={endDate}
						disabled={repeat === 'never' || noEndDate}
					/>
					<Checkbox
						type="checkbox"
						name="no-end-date"
						class="w-full"
						bind:checked={noEndDate}
						disabled={repeat === 'never'}
					>
						No end date
					</Checkbox>
				{/if}
			</Label>
		</div>
		<!-- Checkbox auto receive with description and label -->
		<Label class="space-y-2">
			<div class="flex flex-row justify-stretch space-x-2">
				<Checkbox type="checkbox" name="manual-receive" bind:checked={manualReceive} class="w-full"
					>Does this payment need to be accepted manually?</Checkbox
				>
			</div>
		</Label>

		<!-- submit -->
		<div class="flex flex-row justify-center space-x-2">
			<Button class="w-full" disabled={loading} type="submit">
				{#if loading}
					<Spinner class="mr-3" size="4" color="white" />
				{/if}
				Add</Button
			>
		</div>
	</form>
</Modal>

{#each data.records as record}
	<div in:fly={{ y: 20, duration: 200 }} out:fly={{ y: -20, duration: 200 }}>
		<!-- format date as 17 Jun -->
		{record.date.toLocaleDateString('en-GB', {
			day: 'numeric',
			month: 'short'
		})}
		{#if record.isExpense}
			<span class="text-red-500">-{record.amount} {data.balance.currency}</span>
		{:else}
			<span class="text-green-500">+{record.amount} {data.balance.currency}</span>
		{/if}

		{record.description}
	</div>
{/each}
