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
        <div className={`fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-main-primary text-white shadow-xl transition-all duration-300
                    ${inView ? "pointer-events-none translate-y-4 opacity-0" : "translate-y-0 opacity-100"}`}>
            <Button.Root hoverScale onClick={handleShowCart} className="h-full w-full" aria-label="Abrir carrinho">
                <Button.Badge count={quantity >= 0 ? quantity : 0}/>
                <Button.Icon icon={FaShoppingBag} />
            </Button.Root>
        </div>
    );
};

export default ShoppingBag;
