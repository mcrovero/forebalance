import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	const session = await locals.getSession();
	const redirectUrl = url.searchParams.has('redirect')
		? url.searchParams.get('redirect')
		: '/dashboard';
	if (session?.user) throw redirect(303, redirectUrl!);

	return {
		redirect: redirectUrl
	};
};
