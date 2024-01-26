"use client";

import { iUser } from "@/app/models/iUser";
import { logout } from "./logout";
import { Button } from "../Button";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, logoutUser } from "@/lib/redux/User/userSlice";
import { User } from "@prisma/client";
import { ReduxState } from "@/lib/redux";
import { FaUser } from "react-icons/fa";

interface iIsLogged {
    user: User;
}

export default function IsLogged({ user }: iIsLogged) {
    const { user: currentUser } = useSelector((state: ReduxState) => state.user)
    const [isLogged, setIsLogged] = useState<boolean>(false);
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch( login(user) )
      }, [user]);
    
    const handleLogout = async () => {
        const res = await logout()
        res.status && dispatch(logoutUser())
    }

    if (currentUser.name) {
        return (<p onClick={handleLogout}>{currentUser.name}</p>)
    } else {
        return (
            <Button.Link
                href={"/login"}
                isActiveLink={false}
                text='Account'
                className='text-main-medium flex gap-2'
            >
                <Button.Icon icon={FaUser} />
                Account
            </Button.Link>
        )
    }
}