import { BASE_URL, STRIPE_SECRET_KEY } from '$env/static/private';
import Stripe from 'stripe';

const stripe = new Stripe(STRIPE_SECRET_KEY, {
	apiVersion: '2022-11-15'
});

const addNewCustomer = async (email: any) => {
	const customer = stripe.customers.create({
		email,
		description: 'New Customer'
	});
	return customer;
};

const getCustomerByID = async (id: any) => {
	const customer = stripe.customers.retrieve(id);
	return customer;
};
const createPortalSession = async (customerId: any) => {
	const returnUrl = BASE_URL + '/dashboard';
	const portalSession = await stripe.billingPortal.sessions.create({
		customer: customerId,
		return_url: returnUrl
	});
	return portalSession;
};

export default stripe;

export { addNewCustomer, getCustomerByID, createPortalSession };
