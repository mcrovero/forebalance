import { DefaultSession } from '@auth/core/types';

declare module '@auth/core/types' {
	interface Session {
		user: {
			id: string;
			role: string;
			premium: int;
		} & DefaultSession['user'];
	}
}
