import { HtmlHTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface iButtonProps extends HtmlHTMLAttributes<HTMLParagraphElement>{
    text: string,
    hoverColor?: boolean,
}

export default function ButtonText({ text, hoverColor,...rest }: iButtonProps){
    return (
        <p {...rest} 
            className={twMerge(`text-main-white font-medium ${hoverColor && "hover:text-main-primary"}`, rest.className)}>
            {text}
        </p>
    )
}