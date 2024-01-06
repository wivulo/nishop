"use client";

import { iProduct } from '@/app/models/iProduct';
import React, { HTMLAttributes, useEffect, useRef } from 'react';
import { Button } from '../Button';
import { useDispatch, useSelector } from 'react-redux';
import { ReduxState } from '@/lib/redux';
import { closeDetail } from '@/lib/redux/Details/detailsSlice';
import Image from 'next/image';
import { detailAnimations } from './animations';
import { showNotification } from '@/lib/redux/Notification/notificationSlice';
import { addProduct } from '@/lib/redux/Cart/cartSlice';


const Details: React.FC = () => {
    const { isOpen, product } = useSelector((state: ReduxState) => state.details);
    const { quantity } = useSelector((state: ReduxState) => state.cart);

    const dispatch = useDispatch();
    const detailRef = useRef<HTMLDivElement>(null);

    const handleCloseDetail = () => dispatch(closeDetail());

    const handleAddToCart = () => {
        dispatch(addProduct(product))
        // handleCloseDetail()
        dispatch(showNotification({
            message: "Success to add product to the cart"
        }))
    }

    const detail = detailRef.current;

    useEffect(() => {
        if (isOpen)
            detail && detailAnimations.expandAnimation(detail, isOpen)
    }, [isOpen]);

    return (
        <div ref={detailRef} className={`${isOpen ? "grid" : "hidden"} place-content-center w-screen h-screen fixed left-0 top-0 bg-base-graybackground z-50 overflow-hidden`}>

            <div className="flex">
                <div className="flex-1 flex flex-col gap-5 justify-center">
                    <h2 className='text-text-2'>{product.name}</h2>

                    <p className='text-2xl font-semibold'>
                        {product.description}
                    </p>

                    <p>
                        Price: <span className='font-semibold'>{product.price}</span> $
                    </p>

                    <ul className='flex gap-2'>
                        {product.colors && product.colors?.map((color, index) => (
                            <li key={index} className={`w-6 h-6 rounded-full`} style={{ backgroundColor: color }}></li>
                        ))}
                    </ul>

                    <div className='my-6'>
                        <Button.Root hasbg className='px-16 py-3' onClick={handleAddToCart}>
                            <Button.Text text='Add to cart' />
                        </Button.Root>
                    </div>
                </div>
                <div className="flex-1">
                    {
                        product.imageSrc
                        &&
                        (<Image src={product.imageSrc} alt={product.name} width={600} height={600} />)
                    }
                </div>
            </div>
            <Button.Root className='absolute top-2 right-6' onClick={handleCloseDetail}>
                <Button.Text text='&times;' className='text-4xl font-bold text-text-2' />
            </Button.Root>
        </div>
    );
};

export default Details;
