import { HtmlHTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface iButtonProps extends HtmlHTMLAttributes<HTMLButtonElement>{
    children: ReactNode;
    hasbg?: boolean;
    hoverColor?: boolean;
    hoverScale?: boolean;
    reference?: any;
    type?: "button" | "submit" | "reset";
}

export default function ButtonRoot({ children, hasbg, hoverScale, hoverColor, reference, type,...rest }: iButtonProps){
    return (
        <button {...rest} ref={reference} type={type ? type : "button"}
            className={twMerge(`w-auto h-auto ${hasbg && "bg-main-third"} rounded-full
            flex justify-center items-center gap-x-2 relative transition
            ${hoverScale && "hover:scale-110 transform"}
            `, rest.className)}>
            { children }
        </button>
    )
}