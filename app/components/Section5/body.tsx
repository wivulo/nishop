"use client";
import React from 'react';
import { Productcard } from '../ProductCard';
import { useDispatch } from 'react-redux';
import { openDetail } from '@/lib/redux/Details/detailsSlice';
import { Product } from '@prisma/client';
import { ProductListItem } from '../ProductListItem';
import { ProductListSkelton } from '../ProductListSkelton';


interface BodyProps {
    products: Product[];
    filteredProductsUseQueryState: any;
    ispedding?: boolean
}

const Body: React.FC<BodyProps> = ({ products, filteredProductsUseQueryState: filteredProducts, ispedding }) => {
    const dispatch = useDispatch();

    const handleOpenDetail = (product: Product) => {
        dispatch(openDetail(product));
    };

    let filtered = filteredProducts ? products?.filter(product => product.category?.toLowerCase().includes(filteredProducts.toLowerCase())) : [];

    if(ispedding){
        return <ProductListSkelton />
    }

    return (
        <div className=''>
            <ul className='flex flex-wrap gap-6'>
                {
                    filtered && filtered.length > 0 ?
                        filtered.map((product, i) => {
                            return <li key={product.id} onClick={() => handleOpenDetail(product)}>
                                <Productcard.Root className='w-[295px] h-96'>
                                    <Productcard.Like />
                                    <Productcard.Image
                                        src={product.imageSrc}
                                        width={500}
                                        height={500}
                                        alt={product.name}
                                        className='w-[200px] h-[200px]'
                                    />
                                    <Productcard.Description text={product.description} />
                                    {
                                        product.colors.length > 0
                                        &&
                                        (<Productcard.Colors>
                                            {product.colors.split("#").filter(color => color.length > 0).map(
                                                (color, i) => (
                                                    <Productcard.Color
                                                        key={i}
                                                        color={"#" + color.replace(",", "")}
                                                    />
                                                )
                                            )}
                                        </Productcard.Colors>)
                                    }
                                    <Productcard.Price
                                        className={`${!product.colors.length && "absolute bottom-7"}`}
                                        price={product.price}
                                    />
                                </Productcard.Root>
                            </li>
                        })
                        :
                        products?.map((product, i) => {
                            return <ProductListItem
                                product={product}
                                index={i}
                                onOpenProductDetail={handleOpenDetail}
                                key={product.id}
                            />
                        })}
            </ul>
        </div>
    );
};

export default Body;
