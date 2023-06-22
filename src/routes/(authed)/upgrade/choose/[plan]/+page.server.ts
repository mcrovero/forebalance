import type { PageServerLoad } from './$types';
import { STRIPE_PLAN_STARTER, STRIPE_PLAN_ADVANCED } from '$env/static/private';

import stripe, { createPortalSession } from '$lib/stripe';
import { redirect } from '@sveltejs/kit';
import prisma from '$lib/prisma';

export const load: PageServerLoad = async (event) => {
	const session = await event.locals.getSession();
	if (!session?.user) throw redirect(303, '/login');
	const userId = session.user.id;
	const user = await prisma.user.findUnique({
		where: {
			id: userId
		}
	});
	if (!user) throw redirect(303, '/login');

	// check if user already has a subscription
	if (user.stripeSubscriptionStatus) {
		const portalSession = await createPortalSession(user.stripeCustomerId);
		throw redirect(303, portalSession.url);
	}

	const plan = event.params.plan;

	let priceId;
	if (plan === 'starter') {
		priceId = STRIPE_PLAN_STARTER;
	} else if (plan === 'advanced') {
		priceId = STRIPE_PLAN_ADVANCED;
	} else {
		throw new Error('Invalid plan');
	}
	const stripeSession = await stripe.checkout.sessions.create({
		mode: 'subscription',
		payment_method_types: ['card'],
		line_items: [
			{
				price: priceId,
				quantity: 1
			}
		],
		success_url: `${process.env.BASE_URL}/upgrade/success?session_id={CHECKOUT_SESSION_ID}`,
		cancel_url: `${process.env.BASE_URL}/pricing`
	});

	// Save the session ID on the user
	await prisma.user.update({
		where: {
			id: userId
		},
		data: {
			stripeSessionId: stripeSession.id
		}
	});

	if (stripeSession === null) {
		throw new Error('Invalid session');
	}
	if (stripeSession.url === null) {
		throw new Error('Invalid session url');
	}
	// redirect to checkout
	throw redirect(302, stripeSession.url);
};
