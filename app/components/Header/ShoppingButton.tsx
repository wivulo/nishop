"use client";

import { useDispatch, useSelector } from "react-redux";
import { Button } from "../Button";
import { ReduxState } from "@/lib/redux";
import { useEffect, useRef } from "react";
import { showCart } from "@/lib/redux/Cart/cartSlice";
import { useIntersectionObserver } from "@react-hooks-library/core";
import { setIsInView } from "@/lib/redux/ShoppingBag/shoppingBagSlice";
import { FaShoppingBag } from "react-icons/fa";


interface iShoppingProps {
}

export default function ShoppingButton({ }: iShoppingProps) {
    const { quantity } = useSelector((state: ReduxState) => state.cart);
    const dispatch = useDispatch();
    const shoppingBag = useRef<HTMLButtonElement>(null);

    const handleShowCart = () => dispatch(showCart())

    const { inView } = useIntersectionObserver(shoppingBag);
    useEffect(() => {
        dispatch(setIsInView(inView))
    }, [inView])


    return (
        <Button.Root hoverScale reference={shoppingBag} onClick={handleShowCart}>
            <Button.Badge count={quantity} />
            <Button.Icon icon={FaShoppingBag} />
            <Button.Text text='Shopping' className='text-main-medium' />
        </Button.Root>
    )
}