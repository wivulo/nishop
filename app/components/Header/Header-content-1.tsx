"use server";
import IsLogged from "./IsLogged";
import ShoppingButton from "./ShoppingButton";
import { cookies } from 'next/headers';
import SearchProduct from './SearchProduct';

export default async function HeaderContent1() {
  let user: any = cookies().has("user") ? JSON.parse(cookies().get("user")?.value!) : {};
  
  return (
    <div className="button-group flex w-full min-w-0 items-center gap-3 sm:w-auto sm:flex-1 sm:justify-end md:gap-5">
      <SearchProduct />
      <div className="hidden shrink-0 sm:block"><IsLogged user={user}/></div>
      <ShoppingButton />
    </div>
  )
}
