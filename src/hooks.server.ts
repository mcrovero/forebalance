import {
	EMAIL_FROM,
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	SMTP_HOST,
	SMTP_PASSWORD,
	SMTP_PORT,
	SMTP_USER
} from '$env/static/private';
import Email from '@auth/core/providers/email';
import Google from '@auth/core/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { SvelteKitAuth } from '@auth/sveltekit';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const handle = SvelteKitAuth({
	adapter: PrismaAdapter(prisma),
	providers: [
		//@ts-expect-error issue https://github.com/nextauthjs/next-auth/issues/6174
		Google({
			clientId: GOOGLE_CLIENT_ID,
			clientSecret: GOOGLE_CLIENT_SECRET
		}),
		//@ts-expect-error issue https://github.com/nextauthjs/next-auth/issues/6174
		Email({
			server: {
				host: SMTP_HOST,
				port: Number(SMTP_PORT),
				auth: {
					user: SMTP_USER,
					pass: SMTP_PASSWORD
				}
			},
			from: EMAIL_FROM
		})
	],
	callbacks: {
		session: async ({ session, user }) => {
			if (session && user && session.user) {
				session.user.id = user.id;
				session.user.premium = user.premium;
			}
			return session;
		}
	}
});
