import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma/prisma';
import { Product } from '@prisma/client';

export async function GET(req: Request, res: Response) {
    try {

        const products = await prisma.product.findMany()
        .catch(async (e) => {
            throw new Error(e)
        })

        await prisma.$disconnect()
        return NextResponse.json({ message: 'Products fetched successfully', products: products });
        
    } catch (e) {
        console.log(e);
        await prisma.$disconnect()
        return NextResponse.json({ message: e, product: null });
    }
};
