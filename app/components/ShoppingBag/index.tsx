"use client";

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../Button';
import { ReduxState } from '@/lib/redux';
import { showCart } from '@/lib/redux/Cart/cartSlice';
import { FaShoppingBag } from 'react-icons/fa';

function ShoppingBag() {
    const { quantity } = useSelector((state: ReduxState) => state.cart);
    const { inView } = useSelector((state: ReduxState) => state.shoppingBag);
    const dispatch = useDispatch();

    const handleShowCart = () => dispatch(showCart())

    return (
        <div className={`fixed self-end top-1/2 -bottom-10 flex w-8 h-8 mr-5 z-50 rounded-full
                    bg-base-soft justify-center items-center transform transition-all duration-500
                    ${inView ? "opacity-0 translate-x-full" : "opacity-100 translate-x-0"}`}>
            <Button.Root hoverScale onClick={handleShowCart}>
                <Button.Badge count={quantity}/>
                <Button.Icon icon={FaShoppingBag} />
            </Button.Root>
        </div>
    );
};

export default ShoppingBag;
