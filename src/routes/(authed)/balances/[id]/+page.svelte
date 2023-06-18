<script lang="ts">
	import { enhance } from '$app/forms';
	import Chart, { type ChartItem } from 'chart.js/auto';
	import 'chartjs-adapter-date-fns';
	import {
		Button,
		Card,
		Checkbox,
		Hr,
		Input,
		Label,
		Modal,
		Select,
		Spinner,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';

	import { getNegativeGradient, getPositiveGradient } from '$lib/utils/chart.js';
	import { afterUpdate, onMount } from 'svelte';

	export let data: any;
	export let form;

	let isLoading = false;
	let isEditingBalance = false;
	let showModal = false;
	let isExpense = false;
	let description = '';
	let amount = 0;
	let date = new Date();
	let repeat = 'never';
	let endDate: Date | null = new Date();
	let manualReceive = false;
	let noEndDate = true;

	let from = data.from.toISOString().split('T')[0];
	let to = data.to.toISOString().split('T')[0];

	let loading = false;

	// If repeat is never then disable endDate
	$: if (repeat === 'never' || noEndDate === true) {
		endDate = null;
	}

	let chart = null;
	function updateChart() {
		// Get one record per day
		let recordsMap = {};
		for (let record of data.records) {
			let date = record.date.toISOString().split('T')[0];
			recordsMap[date] = record.balanceAtRecord;
		}
		let records = Object.keys(recordsMap).map((date) => {
			return {
				date: new Date(date),
				balanceAtRecord: recordsMap[date]
			};
		});

		chart.data.labels = records.map(
			(
				record: {
					date: any;
				} // if precedent record has different year sho
			) => record.date
		);
		chart.data.datasets[0].data = records.map(
			(record: { balanceAtRecord: any }) => record.balanceAtRecord
		);
		chart.update();
	}

	afterUpdate(() => {
		console.log('after update');
		updateChart();
	});

	onMount(() => {
		const ctx = document.getElementById('chart') as ChartItem;
		chart = new Chart(ctx, {
			//Type of the chart
			type: 'line',
			data: {
				datasets: [
					{
						//The label for the dataset which appears in the legend and tooltips.
						label: 'Balance',
						//styling of the chart
						borderWidth: 0,
						//cubicInterpolationMode: 'monotone',
						fill: {
							target: 'origin',
							above: function (context) {
								const chart = context.chart;
								const { ctx, chartArea } = chart;

								if (!chartArea) {
									// This case happens on initial chart load
									return;
								}
								return getPositiveGradient(ctx, chartArea);
							},
							below: function (context) {
								const chart = context.chart;
								const { ctx, chartArea } = chart;

								if (!chartArea) {
									// This case happens on initial chart load
									return;
								}
								return getNegativeGradient(ctx, chartArea);
							}
						}
					}
				]
			},
			//options for the chart
			options: {
				responsive: true,
				maintainAspectRatio: true,
				aspectRatio: 3,
				plugins: {
					legend: {
						display: false
					}
				},
				scales: {
					x: {
						type: 'time',
						time: {
							unit: 'month',
							tooltipFormat: 'dd MMM yyyy'
						},
						grid: {
							display: false
						}
					},
					y: {
						display: false
					}
				}
			}
		});
	});
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
				<Input type="date" name="from" required bind:value={from} />
			</div>
			<div>
				<span>To</span>
				<Input type="date" name="to" required bind:value={to} />
			</div>
			<Button type="submit" outline={true} disabled={isLoading}>Update</Button>
		</div>
	</form>
	<Hr />
	<canvas id="chart" />
	<div class="flex flex-col gap-4 items-stretch sm:flex-row sm:justify-stretch sm:items-stretch">
		<Card class="flex-grow">
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
		<Card class="flex-grow">
			<div class="flex flex-col items-center h-full justify-center">
				<span class="text-lg font-medium text-gray-900 dark:text-white">Income</span>
				<span class="text-2xl font-bold text-blue-500"
					>{data.totalIncome} {data.balance.currency}</span
				>
			</div>
		</Card>
		<Card class="flex-grow">
			<div class="flex flex-col items-center h-full justify-center">
				<span class="text-lg font-medium text-gray-900 dark:text-white">Expenses</span>
				<span class="text-2xl font-bold text-red-500"
					>{data.totalExpenses} {data.balance.currency}</span
				>
			</div>
		</Card>
	</div>
	<div class="flex flex-row justify-end">
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
	</div>

	<Table class="mt-4">
		<TableHead>
			<TableHeadCell>Date</TableHeadCell>
			<TableHeadCell>Amount</TableHeadCell>
			<TableHeadCell>Description</TableHeadCell>
			<TableHeadCell>Balance</TableHeadCell>
			<!-- <TableHeadCell /> -->
		</TableHead>
		<TableBody>
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
				<TableBodyRow>
					<TableBodyCell>
						<!-- format date as 17 Jun -->
						{record.date.toLocaleDateString('en-GB', {
							day: 'numeric',
							month: 'short'
						})}
					</TableBodyCell>
					<TableBodyCell>
						{#if record.isExpense}
							<span class="text-red-500">-{record.amount} {data.balance.currency}</span>
						{:else}
							<span class="text-blue-500">+{record.amount} {data.balance.currency}</span>
						{/if}
					</TableBodyCell>
					<TableBodyCell>
						{record.description}
					</TableBodyCell>
					<TableBodyCell>
						{record.balanceAtRecord}
					</TableBodyCell>
					<!-- <TableBodyCell>
						
					</TableBodyCell> -->
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
</div>

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
