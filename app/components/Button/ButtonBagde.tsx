import { ElementType, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface iButtonProps{
    count: number
}

export default function ButtonBadge({ count }: iButtonProps){
    return (
        <span className={twMerge(`text-base absolute text-main-white bg-main-third rounded-full 
        -top-4 left-4 grid place-content-center w-5 h-5`)}>
            {count}
        </span>
    )
}