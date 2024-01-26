import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma/prisma';
import { ERequestState } from '@/app/models/eRequestState';

export async function POST(req: Request, res: Response){
    const body = await req.json();
    console.log(body);
    const { email, password } = body;

    const match = await prisma.user.findUnique({
        where: {
            email: email,
            password: password
        }
    }).catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })

    await prisma.$disconnect()

    if(match)
        return NextResponse.json({message: 'User logged out successfully', user: match });
    else
        return NextResponse.json({message: "Email or Password wrong! Please, try again", user: null });
};
