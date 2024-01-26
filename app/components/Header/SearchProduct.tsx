"use client";

import React, { use, useEffect, useState } from 'react';
import { useQueryState } from 'nuqs';
import { Input } from '../CustomInput';
import { FaSearch } from 'react-icons/fa'
import { Button } from '../Button';
import Link from 'next/link';
import { usePathname } from 'next/navigation'

const searchData = ["Chocolate", "Coconut", "Strawberry"]

const SearchProduct: React.FC = () => {
    const [product, setProduct] = useState<string>('');
    const [filteredProduct, setFilteredProduct] = useQueryState('product');

    const pathname = usePathname()

    return (
        <>
            <Input.Root>
                <Input.Combo data={searchData}></Input.Combo>
                {
                    !pathname.includes("/products") ?
                        (
                            <>
                                <Input.Input
                                    placeholder="Search anything"
                                    name="searchFild1"
                                    onChange={e => setProduct(e.currentTarget.value)}
                                />

                                <Button.Root hoverScale className='mr-3'>
                                    <Link href={`/products?product=${product}`} passHref>
                                        <Button.Icon icon={FaSearch} className='text-lg' />
                                    </Link>
                                </Button.Root>
                            </>
                        )
                        :
                        (
                            <>
                                <Input.Input
                                    placeholder="Search anything"
                                    name="searchFild3"
                                    onChange={e => setFilteredProduct(e.currentTarget.value)}
                                />

                                <Button.Root hoverScale className='mr-3'>
                                    <Link href={`/products?product=${filteredProduct}`} passHref>
                                        <Button.Icon icon={FaSearch} className='text-lg' />
                                    </Link>
                                </Button.Root>
                            </>
                        )
                }
            </Input.Root>
        </>
    );
};

export default SearchProduct;
