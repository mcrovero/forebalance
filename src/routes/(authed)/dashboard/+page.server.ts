import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import prisma from '$lib/prisma';

export const load: PageServerLoad = async (event) => {
	const session = await event.locals.getSession();
	if (!session?.user) throw redirect(303, '/login');
	const user = await prisma.user.findUnique({
		where: {
			email: session!.user!.email!
		}
	});

	return {};
};
