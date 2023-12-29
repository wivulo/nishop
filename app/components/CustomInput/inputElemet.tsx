import { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface iInputElementProps extends HTMLAttributes<HTMLInputElement>{
    placeholder: string,
    name: string,
}


export default function InputElement({ placeholder, name, ...rest}: iInputElementProps) {
    return (
        <input type="text" {...rest}
            className={twMerge(`grow shrink basis-0 text-neutral-400 text-sm bg-transparent outline-none 
            hover:outline-none focus:outline-none font-medium`, rest.className)}
            placeholder={placeholder}
            name={name}
        />
    )
}