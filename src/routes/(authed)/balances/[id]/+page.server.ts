import { fail, redirect } from '@sveltejs/kit';

import prisma from '$lib/prisma';
import type { PageServerLoad } from './$types';

async function getRecordsBetweenDates(balanceId: number, start: Date, end: Date) {
	console.log('getRecordsBetweenDates', balanceId, start, end);
	const records = await prisma.record.findMany({
		where: {
			balanceId: balanceId,
			date: {
				gte: start,
				lte: end
			}
		}
	});
	const recurrents = await prisma.recurrent.findMany({
		where: {
			balanceId: balanceId,
			startDate: {
				lte: end
			},
			OR: [
				{
					endDate: null
				},
				{
					endDate: {
						gte: start
					}
				}
			]
		}
	});
	for (let recurrent of recurrents) {
		const { amount, isExpense, description, startDate, frequency, endDate, autoReceive } =
			recurrent;
		while (startDate <= (endDate ?? end)) {
			// Copy date because it's a reference and will change in the next iteration
			const date = new Date(startDate);
			records.push({
				id: -1,
				amount,
				isExpense,
				description,
				date,
				received: false,
				autoReceive,
				balanceId,
				createdAt: new Date(),
				updatedAt: new Date(),
				recurrentId: recurrent.id
			});
			switch (frequency) {
				case 'daily':
					startDate.setDate(startDate.getDate() + 1);
					break;
				case 'weekly':
					startDate.setDate(startDate.getDate() + 7);
					break;
				case 'monthly':
					startDate.setMonth(startDate.getMonth() + 1);
					break;
				case 'yearly':
					startDate.setFullYear(startDate.getFullYear() + 1);
					break;
			}
		}
	}
	records.sort((a, b) => a.date.getTime() - b.date.getTime());

	return records;
}

// function to get all records passed but not received
async function getRecordsNotReceived(balanceId: number, startDate: Date) {
	const records = await prisma.record.findMany({
		where: {
			balanceId: balanceId,
			date: {
				lte: startDate
			},
			received: false
		}
	});
	return records;
}

export const load: PageServerLoad = async (event) => {
	// get balance id from url
	const { id } = event.params;
	// get end date from url
	const from = event.url.searchParams.get('from');
	const to = event.url.searchParams.get('to');
	console.log('from', from, 'to', to);

	// Get balance from db
	const balance = await prisma.balance.findUnique({
		where: {
			id: Number(id)
		}
	});

	// If balance doesn't exist, redirect to dashboard
	if (!balance) {
		return redirect(303, '/dashboard');
	}

	const startDate = from ? new Date(from) : new Date();
	// start date + 3 months
	let endDate;
	if (!to) {
		endDate = new Date(startDate);
		endDate.setMonth(endDate.getMonth() + 6);
	} else {
		endDate = new Date(to);
	}

	const records = await getRecordsBetweenDates(balance.id, startDate, endDate);
	const recordsPending = await getRecordsNotReceived(balance.id, startDate);

	// Add to each record the balance at that moment
	let currentBalance = balance.amount;

	for (let record of recordsPending) {
		if (record.isExpense) {
			currentBalance -= record.amount;
		} else {
			currentBalance += record.amount;
		}
		record.balanceAtRecord = currentBalance;
	}

	for (let record of records) {
		if (record.isExpense) {
			currentBalance -= record.amount;
		} else {
			currentBalance += record.amount;
		}
		record.balanceAtRecord = currentBalance;
	}

	// Get one record per day
	let recordsMap = {};
	for (let record of records) {
		let date = record.date.toISOString().split('T')[0];
		recordsMap[date] = record.balanceAtRecord;
	}
	let chartData = Object.keys(recordsMap).map((date) => {
		return {
			date: new Date(date),
			balanceAtRecord: recordsMap[date]
		};
	});
	chartData.sort((a, b) => a.date.getTime() - b.date.getTime());
	console.log('chartData', chartData);
	return {
		balance,
		records,
		chartData,
		from: startDate,
		to: endDate,
		totalIncome: records.reduce((acc, record) => {
			if (!record.isExpense) {
				acc += record.amount;
			}
			return acc;
		}, 0),
		totalExpenses: records.reduce((acc, record) => {
			if (record.isExpense) {
				acc += record.amount;
			}
			return acc;
		}, 0),
		recordsPending
	};
};

// addRecord action
export const actions = {
	async addRecord({ request, params }) {
		console.log('addRecord action');
		const data = await request.formData();
		const amount = data.get('amount') as string;
		const balanceId = data.get('balanceId') as string;
		const isExpense = data.get('is-expense') as string;
		const description = data.get('description') as string;
		const date = data.get('date') as string;
		const repeat = data.get('repeat') as string;
		const endDate = data.get('end-date') as string;
		const manualReceive = data.get('manual-receive') as string;
		const noEndDate = data.get('no-end-date') as string;

		if (amount === '' || amount === null || amount === undefined || amount === '0')
			return fail(400, { amount, missing: 'Amount is required' });

		if (repeat === 'never') {
			await prisma.record.create({
				data: {
					amount: Number(amount),
					isExpense: isExpense === 'true',
					description: description,
					date: new Date(date),
					received: false,
					autoReceive: false,
					balance: {
						connect: {
							id: Number(balanceId)
						}
					}
				}
			});
		} else {
			await prisma.recurrent.create({
				data: {
					amount: Number(amount),
					isExpense: isExpense === 'true',
					description: description,
					startDate: new Date(date),
					frequency: repeat,
					endDate: noEndDate === 'on' ? null : new Date(endDate),
					autoReceive: manualReceive === 'on',
					balance: {
						connect: {
							id: Number(balanceId)
						}
					}
				}
			});
		}

		return {
			status: 200
		};
	},
	async updateDate({ request, params }) {
		console.log('updateDate action');
		const data = await request.formData();
		const id = data.get('balanceId') as string;
		const from = data.get('from') as string;
		const to = data.get('to') as string;

		throw redirect(303, `/balances/${id}?from=${from}&to=${to}`);
	},
	async editBalance({ request, params }) {
		console.log('editBalance action');
		const data = await request.formData();
		const id = data.get('balanceId') as string;
		const amount = data.get('amount') as string;

		await prisma.balance.update({
			where: {
				id: Number(id)
			},
			data: {
				amount: Number(amount)
			}
		});

		return {
			status: 200
		};
	}
};
