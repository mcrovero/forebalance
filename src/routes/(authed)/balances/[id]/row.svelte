<script>
	import { Button, Modal, TableBodyCell, TableBodyRow } from 'flowbite-svelte';

	import { enhance } from '$app/forms';
	import AvTimer from 'svelte-material-icons/AvTimer.svelte';
	import Check from 'svelte-material-icons/Check.svelte';
	import Eye from 'svelte-material-icons/Eye.svelte';
	import EyeOff from 'svelte-material-icons/EyeOff.svelte';
	import AlertBoxOutline from 'svelte-material-icons/AlertBoxOutline.svelte';
	import EditRecord from './edit-record.svelte';

	export let record = {
		id: 0,
		date: new Date(),
		dateString: '',
		amount: 0,
		description: '',
		balanceAtRecord: 0,
		disabled: false,
		isExpense: false,
		recurrentId: null,
		autoReceive: false,
		received: false
	};

	export let balance = {
		currency: 'EUR'
	};

	export let isHistory = false;
	export let isPending = false;

	let popupReceiveModal = false;
	let popupEditRecordModal = false;

	let classRow = 'hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer';
	if (isPending) {
		classRow = 'bg-yellow-100 dark:bg-yellow-800 cursor-pointer hover:bg-yellow-200 dark:hover:bg-yellow-700';
	} else if (isHistory) {
		classRow = 'bg-gray-100 dark:bg-gray-800 cursor-pointer';
	}
</script>

<TableBodyRow
	class={classRow}
	on:click={() => {
		popupEditRecordModal = true;
	}}
>
	<TableBodyCell>
		<!-- format date as 17 Jun -->
		{record.date.toLocaleDateString('en-GB', {
			day: 'numeric',
			month: 'short'
		})}
	</TableBodyCell>
	<TableBodyCell>
		{#if record.isExpense}
			<span class="text-red-500">-{record.amount} {balance.currency}</span>
		{:else}
			<span class="text-blue-500">+{record.amount} {balance.currency}</span>
		{/if}
	</TableBodyCell>
	<TableBodyCell>
		{record.description}
	</TableBodyCell>
	<TableBodyCell>
		{#if record.balanceAtRecord < 0}
			<span class="text-red-500">{record.balanceAtRecord} {balance.currency}</span>
		{:else}
			{record.balanceAtRecord} {balance.currency}
		{/if}
	</TableBodyCell>
	<TableBodyCell class="flex flex-row justify-end space-x-2">
		{#if record.recurrentId}
			<AvTimer class="w-5 h-5 text-primary-500" />
		{:else if !record.received}
			<!-- recieve icon button check -->
			<Button
				class="!p-2"
				on:click={(e) => {
					e.preventDefault();
					e.stopPropagation();
					popupReceiveModal = true;
				}}
			>
				<Check class="w-5 h-5 text-white" />
			</Button>
			<!-- view record icon button -->
			<form action="?/editRecord" method="POST" use:enhance>
				<input type="hidden" name="recordId" value={record.id} />
				<input type="hidden" name="disabled" value={!record.disabled} />
				<!-- prevent default -->
				<Button
					class="!p-2"
					type="submit"
					outline={record.disabled}
					on:click={(e) => {
						e.stopPropagation();
					}}
				>
					{#if !record.disabled}
						<Eye class="w-5 h-5 text-white" />
					{:else}
						<EyeOff class="w-5 h-5 text-primary-500" />
					{/if}
				</Button>
			</form>
		{/if}
	</TableBodyCell>
</TableBodyRow>

<Modal bind:open={popupReceiveModal} size="xs" autoclose={false}>
	<form
		action="?/receiveRecord"
		method="POST"
		use:enhance={() => {
			return async ({ update }) => {
				await update();
				popupReceiveModal = false;
			};
		}}
	>
		<div class="flex flex-col items-center space-y-5">
			<AlertBoxOutline class="w-12 h-12 text-primary-500" />
			<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
				Are you sure you want to receive this record?
			</h3>
			<span>It will be added to your balance.</span>

			<input type="hidden" name="recordId" value={record.id} />
			<Button color="primary" class="mr-2" type="submit">Yes, I'm sure</Button>
			<Button color="alternative" on:click={() => (popupReceiveModal = false)}>No, cancel</Button>
		</div>
	</form>
</Modal>

<EditRecord {record} bind:showModal={popupEditRecordModal} />
