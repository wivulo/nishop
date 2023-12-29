import { ElementType, HtmlHTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface iButtonProps extends HtmlHTMLAttributes<HTMLSpanElement>{
    icon: ElementType
}

export default function ButtonIcon({ icon: Icon, ...rest }: iButtonProps){
    return <Icon {...rest} className={twMerge(`text-2xl text-main-medium`, rest.className)} />
}