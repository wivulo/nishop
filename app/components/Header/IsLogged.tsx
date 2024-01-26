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
import { FaSpinner, FaUser } from "react-icons/fa";
import { useMutation, useQuery } from "@tanstack/react-query";

interface iIsLogged {
    user: User;
}

export default function IsLogged({ user }: iIsLogged) {
    const { user: currentUser } = useSelector((state: ReduxState) => state.user)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch( login(user) )
    }, [user]);

    const { mutate, isPending } = useMutation({
        mutationFn: logout,
        onSuccess: (data) => {
            if(data.status) dispatch(logoutUser())
        }
    })


    if (currentUser.name) {
        if(isPending){
            return (
                <p onClick={() => mutate()}>
                   <div className="animate-spin">
                    <FaSpinner className="w-8 h-8 font-semibold text-lg text-main-third" />
                   </div>
                </p>
            )
        }else{
            return (
                <p onClick={() => mutate()} className="px-5 h-7 text-lg">
                    {currentUser.name}
                </p>
            )
        }
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