import {
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	SMTP_HOST,
	SMTP_PORT,
	SMTP_USER,
	SMTP_PASSWORD,
	EMAIL_FROM
} from '$env/static/private';
import Google from '@auth/core/providers/google';
import Email from '@auth/core/providers/email';
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
	]
});
