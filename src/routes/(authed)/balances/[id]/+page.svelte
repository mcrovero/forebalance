<script lang="ts">
	import { enhance } from '$app/forms';
	import 'chartjs-adapter-date-fns';
	import {
		Button,
		Card,
		Hr,
		Input,
		Table,
		TableBody,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import Plus from 'svelte-material-icons/Plus.svelte';

	import AddRecord from './add-record.svelte';
	import Chart from './chart.svelte';
	import Row from './row.svelte';

	export let data: any;

	let isLoading = false;
	let isEditingBalance = false;
	let showModal = false;

	let from = data.from.toISOString().split('T')[0];
	let to = data.to.toISOString().split('T')[0];
</script>

<!-- full width -->
<div class="flex flex-col w-full space-y-4 justify-stretch">
	<!-- Two inputs to adjust from and to dates on the right side -->
	<form
		action="?/updateDate"
		method="POST"
		use:enhance={() => {
			isLoading = true;
			return async ({ update }) => {
				await update();
				isLoading = false;
			};
		}}
	>
		<div class="flex flex-col gap-4 items-stretch md:flex-row md:justify-end md:items-end">
			<input type="hidden" name="balanceId" value={data.balance.id} />
			<div>
				<span>From</span>
				<!-- max value is today -->
				<Input
					type="date"
					name="from"
					required
					bind:value={from}
					max={new Date().toISOString().split('T')[0]}
				/>
			</div>
			<div>
				<span>To</span>
				<Input
					type="date"
					name="to"
					required
					bind:value={to}
					min={new Date().toISOString().split('T')[0]}
				/>
			</div>
			<Button type="submit" outline={true} disabled={isLoading}>Update</Button>
		</div>
	</form>
	<Hr />
	<Chart chartData={data.chartData} />
	<div class="flex flex-col gap-4 items-stretch sm:flex-row sm:justify-stretch sm:items-stretch">
		<Card class="flex-grow w-full max-w-full">
			<div class="flex flex-col space-y-2">
				<span class="text-lg font-medium text-gray-900 dark:text-white">Balance</span>
				{#if isEditingBalance}
					<form
						action="?/editBalance"
						method="POST"
						use:enhance={() => {
							isLoading = true;
							return async ({ update }) => {
								await update();
								isLoading = false;
								isEditingBalance = false;
							};
						}}
					>
						<input type="hidden" name="balanceId" value={data.balance.id} />
						<Input
							type="number"
							name="amount"
							placeholder="1000"
							required
							bind:value={data.balance.amount}
							class="mb-4"
						/>
						<Button type="button" outline={true} on:click={() => (isEditingBalance = false)}
							>Cancel</Button
						>
						<Button type="submit" disabled={isLoading}>Update</Button>
					</form>
				{:else}
					<span class="text-2xl font-bold">{data.balance.amount} {data.balance.currency}</span>
					<Button
						outline={true}
						on:click={() => {
							isEditingBalance = true;
						}}
					>
						Edit
					</Button>
				{/if}
			</div>
		</Card>
		<Card class="flex-grow w-full max-w-full">
			<div class="flex flex-col items-center h-full justify-center">
				<span class="text-lg font-medium text-gray-900 dark:text-white">Income</span>
				<span class="text-2xl font-bold text-blue-500"
					>{data.totalIncome} {data.balance.currency}</span
				>
			</div>
		</Card>
		<Card class="flex-grow w-full max-w-full">
			<div class="flex flex-col items-center h-full justify-center">
				<span class="text-lg font-medium text-gray-900 dark:text-white">Expenses</span>
				<span class="text-2xl font-bold text-red-500"
					>{data.totalExpenses} {data.balance.currency}</span
				>
			</div>
		</Card>
	</div>
	<div class="flex flex-row justify-end">
		<Button
			on:click={() => {
				console.log('show modal', showModal);
				showModal = true;
			}}
		>
			<Plus class="w-5 h-5 text-white" />
			Add record
		</Button>
	</div>

	<Table class="mt-4">
		<TableHead>
			<TableHeadCell>Date</TableHeadCell>
			<TableHeadCell>Amount</TableHeadCell>
			<TableHeadCell>Description</TableHeadCell>
			<TableHeadCell>Balance</TableHeadCell>
			<TableHeadCell />
		</TableHead>
		<TableBody>
			{#if data.recordsPending.length > 0}
				<TableHeadCell colspan="4">
					<div class="mt-4 mb-2 text-lg font-medium text-red-700 dark:text-white">Pending</div>
				</TableHeadCell>
			{/if}
			{#each data.recordsPending as record}
				<Row {record} balance={data.balance} />
			{/each}

			{#each data.records as record}
				<!-- If record month is different from previous record month then show month -->
				{#if record.date.getMonth() !== data.records[data.records.indexOf(record) - 1]?.date.getMonth()}
					<TableHeadCell colspan="4">
						<div class="mt-4 mb-2 text-lg font-medium text-gray-900 dark:text-white">
							{record.date.toLocaleDateString('en-GB', {
								month: 'long',
								year: 'numeric'
							})}
						</div>
					</TableHeadCell>
				{/if}
				<Row {record} balance={data.balance} />
			{/each}
		</TableBody>
	</Table>
</div>

<AddRecord balance={data.balance} bind:showModal />
