"use client"

import { useRef } from "react"
import { FaUser, FaShoppingBag, FaSearch } from 'react-icons/fa'
import { Button } from '../Button';
import { Input } from '../CustomInput';
import { useDispatch, useSelector } from "react-redux";
import { ReduxState } from "@/lib/redux";
import { showCart } from "@/lib/redux/Cart/cartSlice";
import { useIntersectionObserver } from "@react-hooks-library/core";
import { setIsInView } from "@/lib/redux/ShoppingBag/shoppingBagSlice";

const searchData = ["Chocolate", "Coconut", "Strawberry"]

export default function HeaderContent1() {
  const { quantity } = useSelector((state: ReduxState) => state.cart);
  const dispatch = useDispatch();
  const shoppingBag = useRef<HTMLButtonElement>(null);

  const handleShowCart = () => dispatch(showCart())

  const { inView } = useIntersectionObserver(shoppingBag);
  dispatch(setIsInView(inView));

  return (
    <div className="button-group w-auto flex gap-x-5 items-center z-20">
      <Input.Root>
        <Input.Combo data={searchData}></Input.Combo>
        <Input.Input placeholder="Search anything" name="searchFild1" />

        <Button.Root hoverScale>
          <Button.Icon icon={FaSearch} className='text-lg' />
        </Button.Root>
      </Input.Root>

      <Button.Root hasbg className='px-7 py-4 w-[5.5rem]' hoverScale>
        <Button.Text text='Help' />
      </Button.Root>

      <Button.Root hoverScale>
        <Button.Icon icon={FaUser} />
        <Button.Link href={"/login"} isActiveLink={false} text='Account' className='text-main-medium' />
      </Button.Root>

      <Button.Root hoverScale reference={shoppingBag} onClick={handleShowCart}>
        <Button.Badge count={quantity} />
        <Button.Icon icon={FaShoppingBag} />
        <Button.Text text='Shopping' className='text-main-medium' />
      </Button.Root>
    </div>
  )
}