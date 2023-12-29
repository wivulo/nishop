"use client"

import { useRef } from "react"
import { FaUser, FaShoppingBag, FaSearch } from 'react-icons/fa'
import { Button } from '../Button';
import { Input } from '../CustomInput';

const searchData = ["Chocolate", "Coconut", "Strawberry"]

export default function HeaderContent1(){
    const followLineRef = useRef<HTMLDivElement>(null)
    return (
        <div className="button-group w-auto flex gap-x-5 items-center relative z-20">
            <Input.Root>
              <Input.Combo data={searchData}></Input.Combo>
              <Input.Input placeholder="Search anything" />

              <Button.Root hoverScale>
                <Button.Icon icon={FaSearch} className='text-lg' />
              </Button.Root>
            </Input.Root>

            <Button.Root hasbg className='px-7 py-4 w-[5.5rem]' hoverScale>
              <Button.Text text='Help' />
            </Button.Root>

            <Button.Root hoverScale>
              <Button.Icon icon={FaUser} />
              <Button.Text text='Account' className='text-main-medium' />
            </Button.Root>

            <Button.Root hoverScale>
              <Button.Badge count={3} />
              <Button.Icon icon={FaShoppingBag} />
              <Button.Text text='Shopping' className='text-main-medium' />
            </Button.Root>
          </div>
    )
}