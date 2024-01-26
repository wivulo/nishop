"use client";
import React, { useState } from 'react';
import Wrapper from '../Wrapper';
import Heading from './Heading';
import HeadingItem from './HeadingItem';
import HeadingText from './HeadingText';
import Body from './body';
import { Product } from '@prisma/client';
import { useQueryState } from 'nuqs';

interface Section5Props {
    products: Product[];
    ispedding?: boolean;
}

const emphasisShifted = (values: Product[]) => {
    const emphasizedProducts = values?.filter((value) => value.Emphasis);
    const nonEmphasizedProducts = values?.filter((value) => !value.Emphasis);
    //return [...emphasizedProducts, ...nonEmphasizedProducts];
    let prods: Product[] = []
    emphasizedProducts && emphasizedProducts.map(p => prods.push(p))
    nonEmphasizedProducts && nonEmphasizedProducts.map(p => prods.push(p))
    return prods
};


const Section5: React.FC<Section5Props> = ({ products, ispedding }) => {
    const [filteredProducts, setFilteredProducts] = useQueryState('product-category');

    return (
        <Wrapper className='my-12 px-12'>
            <div className='flex flex-col gap-12'>
                <Heading>
                    <HeadingItem onClick={() => setFilteredProducts("Modern Farmhouse")}>
                        <HeadingText text='Modern Farmhouse'/>
                    </HeadingItem>

                    <HeadingItem onClick={() => setFilteredProducts("Eclectic Decor")}>
                        <HeadingText text='Eclectic Decor'/>
                    </HeadingItem>

                    <HeadingItem onClick={() => setFilteredProducts("Polka Boho")}>
                        <HeadingText text='Polka Boho'/>
                    </HeadingItem>

                    <HeadingItem onClick={() => setFilteredProducts("Minimalist Style")}>
                        <HeadingText text='Minimalist Style'/>
                    </HeadingItem>

                    <HeadingItem onClick={() => setFilteredProducts("Anniversary Gift")}>
                        <HeadingText text='Anniversary Gift'/>
                    </HeadingItem>

                    <HeadingItem onClick={() => setFilteredProducts("Wedding Gifts")}>
                        <HeadingText text='Wedding Gifts'/>
                    </HeadingItem>
                </Heading>

                <Body
                    ispedding={ispedding}
                    products={emphasisShifted(products)} 
                    filteredProductsUseQueryState={filteredProducts}
                />
            </div>
        </Wrapper>
    );
};

export default Section5;
