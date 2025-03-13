"use client";

import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ReduxState } from '@/lib/redux';
import { Button } from '../Button';
import { FaMinus, FaPlus, FaTimes } from 'react-icons/fa';
import { 
    decreaseQuantityPerProduct, 
    hideCart, 
    increaseQuantityPerProduct, 
    removeProduct, 
    updatecart
} from '@/lib/redux/Cart/cartSlice';
import anime from 'animejs';
import { Productcard } from '../ProductCard';
import { showNotification } from '@/lib/redux/Notification/notificationSlice';
import { hideCartAnimation, showCartAnimation } from './animations';
import { useSessionStorage, useLocalStorage } from '@react-hooks-library/core';
import { iCart, iCartProduct } from '@/app/models/icart';
import { iProduct } from '@/app/models/iProduct';

const shoppingCartInitialValue = {
    products: [] as iCartProduct[],
        quantity: 0,
        total: 0,
        showCart: false
}

const Cart: React.FC = () => {
    const { showCart, products, quantity, total } = useSelector((state: ReduxState) => state.cart);
    const dispatch = useDispatch()
    const cartRef = useRef<HTMLDivElement>(null)
    const [shoppingCart, setShoppingCart] = useSessionStorage<iCart>("Shopping-Cart", shoppingCartInitialValue)

    const handleCloseCart = () => dispatch(hideCart())
    const handleRemoveProduct = (id?: number) => {
        if(!id) return
        dispatch(removeProduct({id: id}))
    }

    const handleIncreaseProduct = (id?: number) => {
        if(!id) return
        dispatch(increaseQuantityPerProduct({id: id}))
        dispatch( showNotification({message: "Product quantity increased"}))
    }
    const handledecreaseProduct = (id?: number) => {
        if(!id) return
        dispatch(decreaseQuantityPerProduct({id: id}))
    }

    useEffect(() => {
        showCart? showCartAnimation(anime, cartRef.current) : hideCartAnimation(anime, cartRef.current);
    }, [showCart]);

    useEffect(() => {
        let sessionShoppingCart = sessionStorage.getItem("Shopping-Cart")
        const sessionCartSerialized = sessionShoppingCart && JSON.parse(sessionShoppingCart)
        
        if(quantity === -1 && (sessionCartSerialized && sessionCartSerialized.quantity)){
            dispatch(updatecart({
                products: sessionCartSerialized.products,
                quantity: sessionCartSerialized.quantity,
                total: sessionCartSerialized.total
            }))
        }
    }, []);

    useEffect(() => {
        let sessionShoppingCart = shoppingCart;
        if(quantity >= 0){
            sessionShoppingCart = {
                products: products,
                quantity: quantity,
                total: total,
                showCart: false
            }
            setShoppingCart(sessionShoppingCart);
        }
    }, [quantity])

    return (
        <div ref={cartRef}
            className={`fixed flex transform ${showCart ? "translate-x-0" : "translate-x-full"} right-0 top-0
            w-96 h-screen bg-base-soft shadow shadow-black z-[70] px-3 pt-20 transition-all`}
        >
            <div className='absolute top-0 left-0 flex justify-between w-full p-2'>
                <h3 className='text-main-third text-3xl font-semibold'>Cart</h3>

                <Button.Root className='group' onClick={handleCloseCart}>
                    <Button.Icon icon={FaTimes} className='group-hover:text-[#ff0000]' />
                </Button.Root>
            </div>

            <div className='flex flex-col w-full'>
                <div className='w-full h-4/5 overflow-hidden'>
                    <ul className={`h-auto w-full overflow-y-auto flex flex-col 
                        ${!products.length && " h-full justify-center items-center"} relative overflow-hidden`
                    }>
                        {
                            products.length > 0 ?
                                products.map(cartItem => (
                                    <li key={cartItem.product.id} className='relative animate-translateX'>
                                        <Productcard.Root className='flex-row w-full h-24'>
                                            <Productcard.Image src={cartItem.product.imageSrc} width={300} height={300} className='w-20 h-20 basis-1/3' alt={cartItem.product.name} />
                                            <Productcard.Description text={cartItem.product.description} className='basis-2/3' />
                                            <Productcard.Remove className='my-6' onClick={() => handleRemoveProduct(cartItem.product.id)}/>
                                        </Productcard.Root>

                                        <div className='absolute bottom-2 left-1/3 flex gap-3'>
                                            <Button.Root hoverScale className='rounded-none'
                                                onClick={() => handleIncreaseProduct(cartItem.product.id)}>
                                                <Button.Icon icon={FaPlus} />
                                            </Button.Root>

                                            <p className='w-8 h-8 p-1 text-center'> {cartItem.quatity} </p>

                                            <Button.Root hoverScale className='rounded-none'
                                                onClick={() => handledecreaseProduct(cartItem.product.id)}>
                                                <Button.Icon icon={FaMinus} />
                                            </Button.Root>
                                        </div>
                                    </li>
                                ))
                                :
                                (
                                    <div className='flex'>
                                        <p className='text-center text-xs text-text-2 font-semibold'>Please, select some product to view here!</p>
                                    </div>
                                )
                        }
                    </ul>
                </div>

                <div className='h-1/5'>
                    <p>Quantity: {quantity >= 0 ? quantity : 0 }</p>
                    <p>Total Price: {total} $</p>
                </div>
            </div>

        </div>
    );
};

export default Cart;
