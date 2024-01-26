"use client";
import { NextPage } from 'next';
import Products from './products';
import { getProducts } from '@/app/(shop)/getProducts';
import { useEffect, useState } from 'react';
import { Product } from '@prisma/client';
import { Suspense } from "react";


const ProductsSkelton = () => {
    return (
        <div className='flex w-full h-full gap-4'>
            <div className='w-64 h-80 bg-base-background'></div>
            <div className='w-64 h-80 bg-base-background'></div>
            <div className='w-64 h-80 bg-base-background'></div>
        </div>
    )
}

const ProductsPage: NextPage = () => {
    const [pr, setPr] = useState<Product[]>([]);

    useEffect(() => {
        const getProductsAsync = async () => {
            let products = await getProducts();
            setPr(products);
        }

        getProductsAsync();
    }, []);

    return (
        <div className='min-h-screen w-full'>
            <Suspense fallback={<ProductsSkelton />}>
                <div className='flex w-full h-full'>
                    {
                        pr && pr.length > 0 ?
                            <Products products={pr} />
                            :
                            (<div className='grid place-content-center w-full h-screen'>
                                <p className='text-4xl text-text-6 font-bold'>No products</p>
                            </div>)
                    }
                </div>
            </Suspense>
        </div>
    );
};

export default ProductsPage;
