import stripe from '$lib/stripe';
import { error, json } from '@sveltejs/kit';
import {
	STRIPE_PLAN_ADVANCED,
	STRIPE_PLAN_STARTER,
	STRIPE_WEBHOOK_SECRET
} from '$env/static/private';
import prisma from '$lib/prisma';

// endpoint to handle incoming webhooks
export async function POST({ request }) {
	const body = await request.text();

	const signature = request.headers.get('stripe-signature');
	if (signature === null) {
		throw error(400, 'Invalid request');
	}

	let event;
	try {
		event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);
	} catch (err: any) {
		console.warn('⚠️  Webhook signature verification failed.', err.message);
		throw error(400, 'Invalid request');
	}

	switch (event.type) {
		case 'checkout.session.completed':
			// Save customerId on user with sessionId from event
			await prisma.user.update({
				where: {
					stripeSessionId: event.data.object.id
				},
				data: {
					stripeCustomerId: event.data.object.customer,
					hasStripeCustomer: true,
					stripeSubscriptionId: event.data.object.subscription
				}
			});

			break;
		case 'customer.subscription.updated':
			// Update user's premium tier
			let premiumTier;
			switch (event.data.object.plan.id) {
				case STRIPE_PLAN_STARTER:
					premiumTier = 1;
					break;
				case STRIPE_PLAN_ADVANCED:
					premiumTier = 2;
					break;
				default:
					premiumTier = 0;
					break;
			}
			if (event.data.object.status !== 'active') premiumTier = 0;

			// Subscription was updated
			await prisma.user.update({
				where: {
					stripeCustomerId: event.data.object.customer
				},
				data: {
					stripeSubscriptionId: event.data.object.id,
					stripeSubscriptionStatus: event.data.object.status,
					premium: premiumTier
				}
			});
			break;
		case 'customer.subscription.deleted':
			// Subscription was deleted
			await prisma.user.update({
				where: {
					stripeCustomerId: event.data.object.customer
				},
				data: {
					stripeSubscriptionId: null,
					stripeSubscriptionStatus: null,
					premium: 0
				}
			});
			break;
		default:
		// Unexpected event type
	}

	return json({ received: true });
}
