"use client";
import React, { useState } from 'react';
import Wrapper from '../Wrapper';
import Heading from './Heading';
import HeadingItem from './HeadingItem';
import HeadingText from './HeadingText';
import Body from './body';
import { iProduct } from '@/app/models/iProduct';

interface Section5Props {
    products: iProduct[];
}

const initializeProductsState = (values: iProduct[]): iProduct[] => {
    const emphasizedProducts = values.filter((value) => value.Emphasis);
    const nonEmphasizedProducts = values.filter((value) => !value.Emphasis);
    return [...emphasizedProducts, ...nonEmphasizedProducts];
};


const Section5: React.FC<Section5Props> = ({ products: prods }) => {
    const [products, setProducts] = useState<iProduct[]>(() => initializeProductsState(prods))
    //console.log(products);

    return (
        <Wrapper className='my-12 px-12'>
            <div className='flex flex-col gap-12'>
                <Heading>
                    <HeadingItem>
                        <HeadingText text='Modern'/>
                        <HeadingText text='Farmhouse'/>
                    </HeadingItem>

                    <HeadingItem>
                        <HeadingText text='Eclectic'/> 
                        <HeadingText text='Decor'/>
                    </HeadingItem>

                    <HeadingItem>
                        <HeadingText text='Polka Boho'/> 
                        <HeadingText text='Decor'/>
                    </HeadingItem>

                    <HeadingItem>
                        <HeadingText text='Minimalist'/> 
                        <HeadingText text='Style'/>
                    </HeadingItem>

                    <HeadingItem>
                        <HeadingText text='Anniversary'/>
                        <HeadingText text='Gift'/>
                    </HeadingItem>

                    <HeadingItem>
                        <HeadingText text='Wedding'/>
                        <HeadingText text='Gifts'/>
                    </HeadingItem>
                </Heading>

                <Body products={products} />
            </div>
        </Wrapper>
    );
};

export default Section5;
