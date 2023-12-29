import { iInput } from "@/app/models/iCustomInput"
import { HtmlHTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface iInputProps extends HtmlHTMLAttributes<HTMLDivElement> {
    children: ReactNode,
}

function InputRoot({ children, ...rest }: iInputProps) {
    return (
        <div {...rest}
            className={twMerge(`w-[760px] bg-main-white h-auto rounded-[50px] flex justify-start items-center 
            gap-4 p-2`, rest.className)}>
            {children}
        </div>
    )
}

export default InputRoot;