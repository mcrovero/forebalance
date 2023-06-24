import { fail, redirect } from '@sveltejs/kit';

import prisma from '$lib/prisma';
import type { PageServerLoad } from './$types';

async function getRecordsBetweenDates(
	balanceId: number,
	start: Date,
	end: Date,
	withRecurrent = true,
	received = false,
	autoReceive: boolean | null = null
) {
	const records = await prisma.record.findMany({
		where: {
			balanceId: balanceId,
			date: {
				gte: start,
				lte: end
			},
			received,
			autoReceive: autoReceive !== null ? autoReceive : undefined
		},
		orderBy: {
			date: 'asc'
		}
	});
	if (!withRecurrent) return records;
	const recurrents = await prisma.recurrent.findMany({
		where: {
			balanceId: balanceId,
			startDate: {
				lte: end
			},
			autoReceive: autoReceive !== null ? autoReceive : undefined,
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
			if (startDate >= start) {
				records.push({
					id: -1,
					amount,
					isExpense,
					description,
					date,
					received: false,
					autoReceive: true,
					balanceId,
					disabled: false,
					createdAt: new Date(),
					updatedAt: new Date(),
					recurrentId: recurrent.id
				});
			}
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

export const load: PageServerLoad = async (event) => {
	// get balance id from url
	const { id } = event.params;
	const session = await event.locals.getSession();

	if (!session?.user) {
		throw redirect(303, '/login');
	}
	// get end date from url
	let from = event.url.searchParams.get('from');
	if (from === 'null') from = null;
	const to = event.url.searchParams.get('to');

	// Get balance from db
	const balance = await prisma.balance.findUnique({
		where: {
			id: Number(id)
		}
	});

	// If balance doesn't exist, redirect to dashboard
	if (!balance) {
		throw redirect(303, '/dashboard');
	}

	if (balance.userId !== session.user.id) {
		throw redirect(303, '/dashboard');
	}

	const startDate = from ? new Date(from) : new Date();
	let endDate;
	if (!to) {
		endDate = new Date(startDate);
		endDate.setMonth(endDate.getMonth() + 6);
	} else {
		endDate = new Date(to);
	}

	let yesterday = new Date();
	yesterday.setDate(yesterday.getDate() - 1);
	yesterday = new Date(yesterday.toISOString().split('T')[0]);
	let today = new Date();
	today = new Date(today.toISOString().split('T')[0]);

	// Receive old records with autoReceive
	const recordsToReceive = await getRecordsBetweenDates(
		balance.id,
		new Date(0),
		yesterday,
		false,
		false,
		true
	);
	for (let record of recordsToReceive) {
		await prisma.record.update({
			where: {
				id: record.id
			},
			data: {
				received: true
			}
		});
		if (record.isExpense) {
			balance.amount -= record.amount;
		}
		if (!record.isExpense) {
			balance.amount += record.amount;
		}
		await prisma.balance.update({
			where: {
				id: balance.id
			},
			data: {
				amount: balance.amount
			}
		});
	}

	const previousRecords = await getRecordsBetweenDates(
		balance.id,
		startDate,
		yesterday,
		false,
		true
	);
	const nextRecords = await getRecordsBetweenDates(balance.id, today, endDate, true, false);
	const recordsPending = await getRecordsBetweenDates(
		balance.id,
		new Date(0),
		yesterday,
		false,
		false
	);

	// Add to each record the balance at that moment
	let currentBalance = balance.amount;

	for (let record of recordsPending) {
		var amount = record.amount;
		if (!record.disabled) {
			if (record.isExpense) {
				currentBalance -= record.amount;
			} else {
				currentBalance += record.amount;
			}
		}
		record.balanceAtRecord = currentBalance;
	}
	for (let record of nextRecords) {
		if (!record.disabled) {
			var amount = record.amount;
			if (record.isExpense) {
				currentBalance -= amount;
			} else {
				currentBalance += amount;
			}
		}
		record.balanceAtRecord = currentBalance;
	}

	currentBalance = balance.amount;
	for (let k = previousRecords.length - 1; k >= 0; k--) {
		let record = previousRecords[k];
		var amount = record.amount;
		if (k !== previousRecords.length - 1) {
			if (record.isExpense) {
				currentBalance += amount;
			} else {
				currentBalance -= amount;
			}
		}
		record.balanceAtRecord = currentBalance;
	}

	// Merge records
	const records = [...previousRecords, ...nextRecords];

	// Get one record per day
	let recordsMap = {
		//[startDate.toISOString().split('T')[0]]: balance.amount
	};
	for (let record of records) {
		let date = record.date.toISOString().split('T')[0];
		recordsMap[date] = record.balanceAtRecord;
	}
	// Add current balance if it's not already there
	if (recordsMap[today.toISOString().split('T')[0]] === undefined) {
		recordsMap[today.toISOString().split('T')[0]] = balance.amount;
	}
	let chartData = Object.keys(recordsMap).map((date) => {
		return {
			date: new Date(date),
			balanceAtRecord: recordsMap[date]
		};
	});
	chartData.sort((a, b) => a.date.getTime() - b.date.getTime());
	if (chartData.length === 0) {
		chartData.push({
			date: startDate,
			balanceAtRecord: balance.amount
		});
	} else {
		// If first record is not the start date, add it
		if (chartData[0].date.toISOString().split('T')[0] !== startDate.toISOString().split('T')[0]) {
			chartData.unshift({
				date: startDate,
				balanceAtRecord: chartData[0].balanceAtRecord
			});
		}
		// If last record is not the end date, add it
		if (
			chartData[chartData.length - 1].date.toISOString().split('T')[0] !==
			endDate.toISOString().split('T')[0]
		) {
			chartData.push({
				date: endDate,
				balanceAtRecord: chartData[chartData.length - 1].balanceAtRecord
			});
		}
	}

	const balances = await prisma.balance.findMany({
		where: {
			userId: session.user.id
		}
	});

	return {
		balances,
		balance,
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
		recordsPending,
		nextRecords,
		previousRecords
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
		const repeat = (data.get('repeat') as string) ?? 'never';
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
					autoReceive: manualReceive !== 'on',
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
					autoReceive: false,
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
	async editRecord({ request, params }) {
		console.log('editRecord action');
		const data = await request.formData();
		const id = data.has('recordId') ? (data.get('recordId') as string) : undefined;
		const recurrentId = data.has('recurrentId') ? (data.get('recurrentId') as string) : undefined;
		const disabled = data.has('disabled') ? (data.get('disabled') as string) : undefined;
		const isExpense = data.has('is-expense') ? (data.get('is-expense') as string) : undefined;
		const description = data.has('description') ? (data.get('description') as string) : undefined;
		const date = data.has('date') ? (data.get('date') as string) : undefined;
		const amount = data.has('amount') ? (data.get('amount') as string) : undefined;
		const autoReceive = data.has('auto-receive') ? (data.get('auto-receive') as string) : undefined;

		let updatedRecord: any = {};
		if (disabled !== undefined) updatedRecord['disabled'] = disabled === 'true';
		if (isExpense !== undefined) updatedRecord['isExpense'] = isExpense === 'true';
		if (description !== undefined) updatedRecord['description'] = description;
		if (date !== undefined) updatedRecord['date'] = new Date(date);
		if (amount !== undefined) updatedRecord['amount'] = Number(amount);
		// Do not update autoReceive in recurrent records
		if (autoReceive !== undefined && !recurrentId)
			updatedRecord['autoReceive'] = autoReceive === 'on';

		if (recurrentId) {
			await prisma.recurrent.update({
				where: {
					id: Number(recurrentId)
				},
				data: updatedRecord
			});
		} else {
			await prisma.record.update({
				where: {
					id: Number(id)
				},
				data: updatedRecord
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
		const currency = data.get('currency') as string;
		const name = data.get('name') as string;

		await prisma.balance.update({
			where: {
				id: Number(id)
			},
			data: {
				amount: Number(amount),
				currency,
				name
			}
		});

		return {
			status: 200
		};
	},
	async receiveRecord({ request, params }) {
		console.log('receiveRecord action');
		const data = await request.formData();
		const id = data.get('recordId') as string;

		var record = await prisma.record.update({
			where: {
				id: Number(id)
			},
			data: {
				received: true
			}
		});

		// update balance
		var balance = await prisma.balance.findUnique({
			where: {
				id: record.balanceId
			}
		});

		if (balance === null) return fail(400, { missing: 'Balance not found' });

		if (record.isExpense) {
			balance.amount -= record.amount;
		} else {
			balance.amount += record.amount;
		}

		await prisma.balance.update({
			where: {
				id: balance.id
			},
			data: {
				amount: balance.amount
			}
		});

		return {
			status: 200
		};
	},
	async deleteRecord({ request, params }) {
		console.log('deleteRecord action');
		const data = await request.formData();
		const id = data.get('recordId') as string;
		const recurrentId = data.get('recurrentId') as string;

		if (recurrentId) {
			await prisma.recurrent.delete({
				where: {
					id: Number(recurrentId)
				}
			});
		} else {
			await prisma.record.delete({
				where: {
					id: Number(id)
				}
			});
		}

		return {
			status: 200
		};
	},
	async changeBalance({ request, params, locals }) {
		console.log('changeBalance action');
		const session = await locals.getSession();
		if (!session?.user) throw redirect(303, '/login');
		const userId = session.user.id;
		const data = await request.formData();
		const id = data.get('balanceId') as string;
		if (id === 'new') {
			const balance = await prisma.balance.create({
				data: {
					userId,
					amount: 0,
					currency: 'USD',
					name: 'My new balance'
				}
			});
			throw redirect(303, `/balances/${balance.id}`);
		}
		throw redirect(303, `/balances/${id}`);
	},
	async deleteBalance({ request, params, locals }) {
		console.log('deleteBalance action');
		const session = await locals.getSession();
		if (!session?.user) throw redirect(303, '/login');
		const data = await request.formData();
		const id = data.get('balanceId') as string;
		await prisma.balance.delete({
			where: {
				id: Number(id)
			}
		});
		throw redirect(303, `/dashboard`);
	}
};
