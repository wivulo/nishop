"use client";

import { Productcard } from '@/app/components/ProductCard';
import { openDetail } from '@/lib/redux/Details/detailsSlice';
import { Product } from '@prisma/client';
import { useQueryState } from 'nuqs';
import React from 'react';
import { useDispatch } from 'react-redux';

interface Props {
    products: Product[];
}

const Products: React.FC<Props> = ({ products }) => {
    const [filteredProduct, setFilteredProduct] = useQueryState('product');
    const dispatch = useDispatch();

    const handleOpenDetail = (product: Product) => {
        dispatch(openDetail(product));
    };

    let filtered = filteredProduct ? products.filter(product => product.description.toLowerCase().includes(filteredProduct.toLowerCase())) : [];

    return (
        <div className='min-h-screen p-5'>
            <ul className='flex flex-wrap gap-6'>
                {
                    filtered.length > 0 ?
                        filtered.map(product => (
                            <li key={product.id} onClick={() => handleOpenDetail(product)}>
                                <Productcard.Root className='w-[188px]'>
                                    <Productcard.Like />
                                    <Productcard.Image
                                        src={product.imageSrc}
                                        width={500}
                                        height={500}
                                        alt={product.name}
                                    />
                                    <Productcard.Description text={product.description} />
                                    <Productcard.Price price={product.price} />
                                </Productcard.Root>
                            </li>
                        ))
                        :
                        products.map(product => (
                            <li key={product.id} onClick={() => handleOpenDetail(product)}>
                                <Productcard.Root className='w-[188px]'>
                                    <Productcard.Like />
                                    <Productcard.Image
                                        src={product.imageSrc}
                                        width={500}
                                        height={500}
                                        alt={product.name}
                                    />
                                    <Productcard.Description text={product.description} />
                                    <Productcard.Price price={product.price} />
                                </Productcard.Root>
                            </li>
                        ))
                }
            </ul>
        </div>
    );
};

export default Products;

