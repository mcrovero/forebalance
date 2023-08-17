<script lang="ts">
	import { enhance } from '$app/forms';
	import 'chartjs-adapter-date-fns';
	import {
		Button,
		Card,
		Hr,
		Input,
		Label,
		Modal,
		Select,
		Star,
		Table,
		TableBody,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import Plus from 'svelte-material-icons/Plus.svelte';
	import Delete from 'svelte-material-icons/Delete.svelte';
	import AlertBoxOutline from 'svelte-material-icons/AlertBoxOutline.svelte';

	import AddRecord from './add-record.svelte';
	import Chart from './chart.svelte';
	import Row from './row.svelte';

	export let data: any;

	let isLoading = false;
	let isEditingBalance = false;
	let showModal = false;
	let showModalDelete = false;

	let from = data.from.toISOString().split('T')[0];
	let to = data.to.toISOString().split('T')[0];

	let balances = data.balances ?? [];

	let historyEnabled = data.user.premium > 0;
	let multipleBalancesEnabled = data.user.premium > 1;

	let premiumAvailable = false;
</script>

<!-- full width -->
<div class="flex flex-col w-full space-y-4 justify-stretch">
	<div class="flex flex-row justify-between items-center">
		<!-- Select to change balance and button to add new balance -->
		<div class="flex flex-row justify-between items-center">
			<form action="?/changeBalance" method="POST">
				<Select
					name="balanceId"
					bind:value={data.balance.id}
					class="w-full max-w-full"
					onchange="this.form.submit()"
					disabled={!multipleBalancesEnabled && premiumAvailable}
				>
					{#each balances as balance}
						<option value={balance.id}>{balance.name}</option>
					{/each}
					<!-- empty option with separator -->
					<option disabled>──────────</option>
					<!-- Option to add new balance -->
					<option value="new">+ Add new balance</option>
				</Select>
			</form>
			{#if !multipleBalancesEnabled && premiumAvailable}
				<Star class="text-blue-500" />
			{/if}
		</div>

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
				<Label class="space-y-2">
					<div class="flex flex-row items-center justify-start">
						{#if !historyEnabled && premiumAvailable}
							<Star class="text-blue-500" />
						{/if}
						<span>From</span>
					</div>
					<!-- on hover show tooltip with info that this is a premium feature -->
					<Input
						disabled={!historyEnabled && premiumAvailable}
						type="date"
						name="from"
						required
						bind:value={from}
						max={new Date().toISOString().split('T')[0]}
					/>
				</Label>
				<Label class="space-y-2">
					<span>To</span>
					<Input
						type="date"
						name="to"
						required
						bind:value={to}
						min={new Date().toISOString().split('T')[0]}
					/>
				</Label>
				<Button type="submit" outline={true} disabled={isLoading}>Change dates</Button>
			</div>
		</form>
	</div>
	<Hr />
	<Chart chartData={data.chartData} />
	<div class="flex flex-col gap-4 items-stretch sm:flex-row sm:justify-stretch sm:items-stretch">
		<Card class="flex-grow w-full max-w-full">
			<div class="flex flex-col space-y-2">
				{#if isEditingBalance}
					<Button
						color="red"
						outline={true}
						class="w-full max-w-full"
						on:click={() => (showModalDelete = true)}
					>
						<Delete class="w-5 h-5 text-red" />
						Delete balance
					</Button>
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
							type="text"
							name="name"
							placeholder="Name"
							required
							bind:value={data.balance.name}
							class="mb-2"
						/>
						<div class="flex flex-row items-center justify-start gap-2 mb-2">
							<Input
								type="number"
								name="amount"
								placeholder="1000"
								required
								bind:value={data.balance.amount}
							/>
							<Select name="currency" required bind:value={data.balance.currency}>
								<option value="EUR">EUR</option>
								<option value="USD">USD</option>
								<option value="GBP">GBP</option>
							</Select>
						</div>
						<div class="flex flex-row justify-end gap-2">
							<Button
								type="button"
								class="w-full max-w-full"
								outline={true}
								on:click={() => (isEditingBalance = false)}>Cancel</Button
							>
							<Button type="submit" disabled={isLoading} class="w-full max-w-full">Update</Button>
						</div>
					</form>
				{:else}
					<span class="text-lg font-medium text-gray-900 dark:text-white">{data.balance.name}</span>
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
			{#each data.previousRecords as record}
				<!-- If record month is different from previous record month then show month -->
				{#if record.date.getMonth() !== data.previousRecords[data.previousRecords.indexOf(record) - 1]?.date.getMonth()}
					<TableHeadCell colspan="5" class="bg-gray-100 dark:bg-gray-800">
						<div class="mt-4 mb-2 text-lg font-medium text-gray-900 dark:text-white">
							{record.date.toLocaleDateString('en-GB', {
								month: 'long',
								year: 'numeric'
							})}
						</div>
					</TableHeadCell>
				{/if}
				<Row {record} balance={data.balance} isHistory={true} />
			{/each}
			{#if data.recordsPending.length > 0}
				<TableHeadCell colspan="5" class="bg-yellow-100 dark:bg-yellow-800">
					<div class="mt-4 mb-2 text-lg font-medium text-black">Pending</div>
				</TableHeadCell>
			{/if}
			{#each data.recordsPending as record}
				<Row {record} balance={data.balance} isPending={true} />
			{/each}

			{#each data.nextRecords as record}
				<!-- If record month is different from previous record month then show month -->
				{#if record.date.getMonth() !== data.nextRecords[data.nextRecords.indexOf(record) - 1]?.date.getMonth()}
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

<AddRecord balance={data.balance} bind:showModal premium={data.user.premium} />

<Modal bind:open={showModalDelete} size="xs" autoclose={false}>
	<form action="?/deleteBalance" method="POST">
		<div class="flex flex-col items-center space-y-5">
			<AlertBoxOutline class="w-12 h-12 text-red-500" />
			<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
				Are you sure you want to delete this balance?
			</h3>
			<span>It will be deleted permanently.</span>
			<input type="hidden" name="balanceId" value={data.balance.id} />
			<Button color="red" class="mr-2" type="submit">Yes, I'm sure</Button>
			<Button color="alternative" on:click={() => (showModalDelete = false)}>No, cancel</Button>
		</div>
	</form>
</Modal>
