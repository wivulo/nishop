import { Button } from "../Button";
import {FaSearch} from 'react-icons/fa'
import { ElementType, HtmlHTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface iInputProps extends HtmlHTMLAttributes<HTMLDivElement> {
    icon: ElementType,
}

export default function InputButton({ icon }: iInputProps) {
    return (
        <Button.Root>
            <Button.Icon icon={icon} />
        </Button.Root>
    )
}