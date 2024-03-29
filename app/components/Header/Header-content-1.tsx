"use server";
import { FaUser, FaShoppingBag, FaSearch } from 'react-icons/fa'
import { Button } from '../Button';
import { Input } from '../CustomInput';
import IsLogged from "./IsLogged";
import ShoppingButton from "./ShoppingButton";
import { cookies } from 'next/headers';
import { useEffect } from 'react';
import SearchProduct from './SearchProduct';

const searchData = ["Chocolate", "Coconut", "Strawberry"]

export default async function HeaderContent1() {
  let user: any = cookies().has("user") ? JSON.parse(cookies().get("user")?.value!) : {};
  
  return (
    <div className="button-group w-auto flex gap-x-5 items-center z-20">
      <SearchProduct />

      <Button.Root hasbg className='px-7 py-4 w-[5.5rem]' hoverScale>
        <Button.Text text='Help' />
      </Button.Root>

      <Button.Root hoverScale className='w-[99px] h-6'>
          <IsLogged user={user}/>
      </Button.Root>

      <ShoppingButton />
    </div>
  )
}