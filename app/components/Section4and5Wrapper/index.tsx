"use client";
import { getProducts } from '@/app/(shop)/getProducts';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import Section4 from '../Section4';
import Section5 from '../Section5';


const ComponentsProductsWrapper: React.FC = () => {
    const { data: products, isPending } = useQuery({
        queryKey: ["getProductsSection4e5"],
        queryFn: getProducts
    })

    return (
        <div className={`relative w-full h-auto flex flex-col`}>

                    <Section4 products={products} ispedding={isPending} />

                    <Section5 products={products} ispedding={isPending} />

        </div>
    );
};

export default ComponentsProductsWrapper;
