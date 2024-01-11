"use client";

import { iUser } from "@/app/models/iUser";
import { logout } from "./logout";
import { Button } from "../Button";
import { useRouter } from "next/router";
import { useState } from "react";

interface iIsLogged {
    user: iUser;
}

export default function IsLogged({ user }: iIsLogged) {
    const [isLogged, setIsLogged] = useState<boolean>(false)
    
    const handleLogout = async () => {
        await logout()
        
        setIsLogged(prev => !prev);
    }

    if (user.name) {
        return (<p onClick={handleLogout}>{user.name}</p>)
    } else {
        return (
            <Button.Link
                href={"/login"}
                isActiveLink={false}
                text='Account'
                className='text-main-medium'
            />
        )
    }
}