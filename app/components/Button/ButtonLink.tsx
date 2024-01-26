"use client";
import { HtmlHTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface iButtonProps extends LinkProps, HtmlHTMLAttributes<HTMLAnchorElement>{
    text: string;
    isActiveLink: boolean;
    children: any;
}

export default function ButtonLink({children , text, href, isActiveLink, ...rest }: iButtonProps){
    const pathname = usePathname()
    const isActive = pathname === href.toString();
    return (
        <Link {...rest} href={href} 
            className={twMerge(`${isActive && isActiveLink? "text-main-primary": "text-main-regular"} 
            font-medium ${isActiveLink && "hover:text-main-primary"}`, rest.className)}>
            { children }
        </Link>
    )
}