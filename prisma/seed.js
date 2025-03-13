const PrismaClient = require('@prisma/client').PrismaClient;

const prisma = new PrismaClient();

async function main() {
    try {

        //verificar se o usuário já existe
        const userExists = await prisma.user.findUnique({
            where: {
                email: 'suport@nishop.ao'
            }
        });

        if (userExists && userExists?.email) {
            await prisma.user.delete({
                where: {
                    email: 'suport@nishop.ao'
                }
            });
        }

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