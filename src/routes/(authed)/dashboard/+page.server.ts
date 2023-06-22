import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import prisma from '$lib/prisma';

export const load: PageServerLoad = async (event) => {
	const session = await event.locals.getSession();
	if (!session?.user) throw redirect(303, '/login');
	const userId = session.user.id;

	// get user balances
	let balances = await prisma.balance.findMany({
		where: {
			userId
		}
	});
	// Create a new balance if none exists
	if (balances.length === 0) {
		let balance = await prisma.balance.create({
			data: {
				userId,
				amount: 0,
				currency: 'USD',
				name: 'My Balance'
			}
		});
		balances = [balance];
	}

	// if only one balance, redirect to it
	if (balances.length === 1) {
		throw redirect(303, `/balances/${balances[0].id}`);
	} else {
		// if multiple balances, redirect to the first one
		throw redirect(303, `/balances/${balances[0].id}`);
	}
};
