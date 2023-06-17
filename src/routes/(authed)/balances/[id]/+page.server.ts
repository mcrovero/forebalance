import { fail, redirect } from '@sveltejs/kit';

import prisma from '$lib/prisma';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	// get balance id from url
	const { id } = event.params;

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

	const records = await prisma.record.findMany({
		where: {
			balanceId: Number(id)
		}
	});

	const recurrents = await prisma.recurrent.findMany({
		where: {
			balanceId: Number(id)
		}
	});

	return {
		balance,
		records
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
	}
};
