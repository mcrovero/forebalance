// prisma/seed.ts

import { PrismaClient } from '@prisma/client';

const userData = [
	{
		email: 'admin@test.com',
		name: 'Admin',
		balances: [
			{
				amount: 1000,
				currency: 'USD',
				lastUpdated: new Date()
			}
		]
	}
];

const prisma = new PrismaClient();

async function main() {
	console.log(`Start seeding ...`);

	for (const p of userData) {
		const user = await prisma.user.create({
			data: {
				name: p.name,
				email: p.email,
				balances: {
					create: p.balances
				}
			}
		});
		console.log(`Created user with id: ${user.id}`);
	}
	console.log(`Seeding finished.`);
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
