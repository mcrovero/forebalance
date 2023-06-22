import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	const session = await event.locals.getSession();
	const plan = event.params.plan;

	if (!session?.user) {
		if (plan) {
			throw redirect(303, `/login/?redirect=/upgrade/choose/${plan}`);
		}
		throw redirect(303, '/login');
	}
	return {
		user: session.user
	};
};
