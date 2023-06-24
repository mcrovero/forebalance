<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, Checkbox, Hr, Input, Label, Modal, Spinner } from 'flowbite-svelte';
	import AlertBoxOutline from 'svelte-material-icons/AlertBoxOutline.svelte';

	let isLoading = false;

	export let showModal = false;
	export let showModalDelete = false;

	export let record = {
		id: 0,
		date: new Date(),
		amount: 0,
		description: '',
		balanceAtRecord: 0,
		disabled: false,
		isExpense: false,
		recurrentId: null,
		autoReceive: false
	};
</script>

<Modal bind:open={showModal} size="xs" autoclose={false} class="w-full">
	<form
		class="flex flex-col items-stretch space-y-4"
		method="POST"
		action="?/editRecord"
		use:enhance={() => {
			isLoading = true;
			return async ({ update }) => {
				await update();
				showModal = false;
				isLoading = false;
			};
		}}
	>
		<h3 class="mb-2 text-xl font-medium text-gray-900 dark:text-white">
			Edit
			{#if record.recurrentId}
				recurrent
			{:else}
				record
			{/if}
		</h3>
		<Hr />
		<input type="hidden" name="recordId" value={record.id} />
		<input type="hidden" name="recurrentId" value={record.recurrentId} />
		<input type="hidden" name="is-expense" value={record.isExpense} />
		<!-- 2 buttons on the same row occupying full width -->
		<div class="flex flex-row justify-center gap-3">
			<Button
				class="w-full"
				color="blue"
				outline={record.isExpense}
				on:click={() => {
					record.isExpense = false;
				}}
			>
				Income
			</Button>
			<Button
				class="w-full"
				outline={!record.isExpense}
				color="red"
				on:click={() => {
					record.isExpense = true;
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
				bind:value={record.description}
			/>
		</Label>
		<div class="grid gap-3 mb-6 md:grid-cols-2">
			<Label class="space-y-2">
				<span>How much? </span>
				<Input type="number" name="amount" placeholder="1000" required bind:value={record.amount} />
			</Label>

			<Label class="space-y-2">
				<span>When? </span>
				<Input
					disabled={record.recurrentId}
					type="date"
					name="date"
					placeholder="1000"
					required
					value={record.date.toISOString().split('T')[0]}
					min={new Date().toISOString().split('T')[0]}
				/>
			</Label>
		</div>
		{#if record.recurrentId === null}
			<!-- Checkbox auto receive with description and label -->
			<Label class="space-y-2">
				<div class="flex flex-row justify-stretch space-x-2">
					<Checkbox
						type="checkbox"
						name="auto-receive"
						bind:checked={record.autoReceive}
						class="w-full"
					>
						Automatically receive
					</Checkbox>
				</div>
			</Label>
		{/if}

		<!-- submit -->
		<div class="flex flex-row justify-center space-x-2">
			<Button class="w-full" disabled={isLoading} type="submit">
				{#if isLoading}
					<Spinner class="mr-3" size="4" color="white" />
				{/if}
				Save
			</Button>
		</div>
	</form>
	<Hr />
	<Button
		class="w-full"
		color="red"
		outline={true}
		on:click={() => {
			showModalDelete = true;
			showModal = false;
		}}
	>
		Delete</Button
	>
</Modal>

<Modal bind:open={showModalDelete} size="xs" autoclose={false}>
	<form
		action="?/deleteRecord"
		method="POST"
		use:enhance={() => {
			isLoading = true;
			return async ({ update }) => {
				await update();
				showModalDelete = false;
				isLoading = false;
			};
		}}
	>
		<div class="flex flex-col items-center space-y-5">
			<AlertBoxOutline class="w-12 h-12 text-primary-500" />
			<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
				Are you sure you want to delete this record?
			</h3>
			<span>It will be deleted permanently.</span>

			<input type="hidden" name="recordId" value={record.id} />
			<input type="hidden" name="recurrentId" value={record.recurrentId} />
			<Button color="primary" class="mr-2" type="submit">Yes, I'm sure</Button>
			<Button color="alternative" on:click={() => (showModalDelete = false)}>No, cancel</Button>
		</div>
	</form>
</Modal>
