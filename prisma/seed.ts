import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    try {
        await prisma.user.deleteMany({
            where: {
                email: 'suport@nishop.ao'
            }
        });

        const user = await prisma.user.create({
            data: {
                email: 'suport@nishop.ao',
                password: 'admin',
                name: 'Walter Ivulo',
            }
        });

        console.log('Admin User created: ');
        console.log(user);
    } catch (error) {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
    }
}

main()
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    });