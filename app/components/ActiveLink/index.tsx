"use client";

import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Button } from "../Button";

interface iActiveLinkProps extends LinkProps {
    content: string,
    ID: string
}

export default function ActiveLink({href, content, ID,  ...rest}: iActiveLinkProps){
    const pathname = usePathname()
    const isActive = pathname === href.toString();

    return (
        <Link {...rest} href={href} id={ID}>
            <Button.Root>
            <Button.Text 
              text={content} 
              hoverColor 
              className={`text-main-regular ${isActive? "text-main-primary" : ""}`}
            />
          </Button.Root>
        </Link>
    )
}