import { iProduct } from '@/app/models/iProduct';
import React from 'react';
import { Productcard } from '../ProductCard';

interface BodyProps {
    products: iProduct[];
}

const Body: React.FC<BodyProps> = ({ products }) => {
    return (
        <div className=''>
            <ul className='flex flex-wrap gap-6'>
                {products.map((product, i) => {
                    if (product.Emphasis) {
                        if (i === 0) {
                            return (
                                <li key={product.id}>
                                    <Productcard.Root className='w-[295px] h-96 flex justify-center items-center p-0'>
                                        <Productcard.Image
                                            src={product.imageSrc}
                                            width={600}
                                            height={600}
                                            alt={product.name}
                                            className='w-full h-full object-cover'
                                        />
                                    </Productcard.Root>
                                </li>
                            )
                        } else {
                            return (
                                <li key={product.id}>
                                    <Productcard.Root className='w-[295px] h-96'>
                                        <Productcard.Image
                                            src={product.imageSrc}
                                            width={500}
                                            height={500}
                                            alt={product.name}
                                            className='w-[200px] h-[200px]'
                                        />
                                        <Productcard.Description text={product.description} />
                                        <Productcard.Colors>
                                            {product.colors.map((color, i) => (
                                                <Productcard.Color key={i} color={color} />
                                            ))}
                                        </Productcard.Colors>
                                        <Productcard.Price price={product.price} />
                                    </Productcard.Root>
                                </li>
                            )
                        }
                    } else {
                        return (
                            <li key={product.id}>
                                <Productcard.Root className='w-[188px]'>
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
                        )
                    }
                })}
            </ul>
        </div>
    );
};

export default Body;
