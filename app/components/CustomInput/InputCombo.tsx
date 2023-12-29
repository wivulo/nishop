"use client"

import { iInput } from "@/app/models/iCustomInput"
import { HtmlHTMLAttributes, ReactNode, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { SlArrowDown } from "react-icons/sl";
import { Button } from '../Button';
import anime from "animejs";

interface iInputProps extends HtmlHTMLAttributes<HTMLDivElement> {
    data: Array<string>
}

function InputCombo({ data, ...rest }: iInputProps) {
    const [categorie, setCategorie] = useState<string>("All categories")
    
    const [openCategoriesList, setCategorieList] = useState<boolean>(false)

    const inputRef = useRef<HTMLInputElement>(null)
    const comboRef = useRef<HTMLDivElement>(null)

    const handleOpenCategoriesList = () => {
        setCategorieList(prev => !prev)
    }

    const handleChoiceCategories = (categ: string) => {
        setCategorie(categ);
        setCategorieList(prev => !prev)
    }

    return (
        <div className="w-[154px] h-8 px-2 py-1 bg-main-medium/10 rounded-[50px] justify-start items-start gap-2 flex">
            <div className="text-neutral-700 text-xs font-normal flex relative">
                <input className='w-full text-black/80 px-2 h-6 bg-transparent outline-none hover:outline-none focus:outline-none font-medium'
                    name="ice-cream-choice" defaultValue={categorie} ref={inputRef}
                />


                <div ref={comboRef} className={`absolute top-10 bg-white shadow-black shadow rounded-sm p-3 
                    ${openCategoriesList ? "visible opacity-100": "hidden opacity-0"} transition-all delay-150`}>
                    <ul className="flex flex-col gap-y-2 w-32 relative text-main-medium/80 font-medium">
                        {data.map(item => <li key={data.indexOf(item)} className="hover:text-main-regular transition cursor-pointer" onClick={() => handleChoiceCategories(item)}>{item}</li>)}
                    </ul>
                </div>

                <Button.Root className='w-5 h-5 top-1' onClick={handleOpenCategoriesList}>
                    <Button.Icon icon={SlArrowDown} />
                </Button.Root>

            </div>
            <div className="w-4 h-4 relative"></div>
        </div>
    )
}

export default InputCombo;