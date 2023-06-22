import { BASE_URL } from '$env/static/private';
import prisma from '$lib/prisma';
import stripe, { createPortalSession } from '$lib/stripe';
import { redirect } from '@sveltejs/kit';

export async function POST(event) {
	const session = await event.locals.getSession();
	if (!session?.user) {
		throw redirect(303, '/login');
	}

	const user = await prisma.user.findUnique({
		where: {
			id: session.user.id
		}
	});

	if (!user) {
		throw redirect(303, '/login');
	}

	const customerId = user.stripeCustomerId;
	if (!customerId) {
		throw redirect(303, '/dashboard');
	}

	const portalSession = await createPortalSession(customerId);
	throw redirect(303, portalSession.url);
}
