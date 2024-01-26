"use client";
import { NextPage } from 'next';
import Products from './products';
import { getProducts } from '@/app/(shop)/getProducts';
import { useEffect, useState } from 'react';
import { Product } from '@prisma/client';
import { Suspense } from "react";
import { useQuery } from '@tanstack/react-query';
import { ProductListSkelton } from '@/app/components/ProductListSkelton';


const ProductsPage: NextPage = () => {
    const [pr, setPr] = useState<Product[]>([]);

    const {data, isPending} = useQuery({
        queryKey: ["products"],
        queryFn: getProducts
    })

    return (
        <div className='min-h-screen w-full'>
            {
                isPending ?
                (
                    <ProductListSkelton />
                )
                :
                (<div className='flex w-full h-full'>
                    {
                        data && data.length > 0 ?
                            <Products products={data} />
                            :
                            (<div className='grid place-content-center w-full h-screen'>
                                <p className='text-4xl text-text-6 font-bold'>No products</p>
                            </div>)
                    }
                </div>)
            }
        </div>
    );
};

export default ProductsPage;
