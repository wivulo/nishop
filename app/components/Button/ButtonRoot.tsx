import { HtmlHTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface iButtonProps extends HtmlHTMLAttributes<HTMLButtonElement>{
    children: ReactNode,
    hasbg?: boolean,
    hoverColor?: boolean,
    hoverScale?: boolean
}

export default function ButtonRoot({ children, hasbg, hoverScale, hoverColor, ...rest }: iButtonProps){
    return (
        <button {...rest}
            className={twMerge(`w-auto h-auto ${hasbg && "bg-main-third"} rounded-full
            flex justify-center items-center gap-x-2 relative transition
            ${hoverScale && "hover:scale-110 transform"}
            `, rest.className)}>
            { children }
        </button>
    )
}