import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma/prisma';
import { Product } from '@prisma/client';

export async function POST(req: Request, res: Response) {
    const body = await req.json();
    console.log(body);
    const { name, description, price, imageSrc, colors, Emphasis, category}: Product = body;

    try {
        const match = await prisma.product.findUnique({
            where: {
                name: name
            }
        }).catch(async (e) => {
            throw new Error(e)
        })

        if (!match) {
            const product = await prisma.product.create({
                data: {
                    name: name,
                    description: description,
                    price: price,
                    imageSrc: imageSrc,
                    colors: colors ?? [],
                    Emphasis: Emphasis,
                    category: category
                }
            }).catch(async (e) => {
                throw new Error(e)
            })

            await prisma.$disconnect()
            return NextResponse.json({ message: 'Product added successfully', product: product });
        }else{
            await prisma.$disconnect()
            return NextResponse.json({ message: 'Product already exists', product: null });
        }
    } catch (e) {
        console.log(e);
        await prisma.$disconnect()
        return NextResponse.json({ message: e, product: null });
    }
};
