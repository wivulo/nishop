"use client";

import Logo from '@/app/components/Logo';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { getUserAlt, getUser } from "@/app/(auth)/actions";
import { useDispatch } from 'react-redux';
import { showNotification } from '@/lib/redux/Notification/notificationSlice';
import { ERequestState } from '@/app/models/eRequestState';
import { Input } from '@/app/components/CustomInput';
import { Button } from '@/app/components/Button';
import { FaUser } from 'react-icons/fa';
import { redirect } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import Loading from '@/app/components/Loading';

const initialState = {
    state: "",
    message: '',
    user: null
}

function Login() {
    const [isClient, setIsClient] = useState(false)
    // const [state, formAction] = useFormState(getUser, initialState);
    // const [isLoading, setIsLoading] = useQueryState("isloading")

    const dispatch = useDispatch();

    useEffect(() => {
        setIsClient(true)
    }, [])

    // useEffect(() => {
    //     if (state.state != "") {
    //         dispatch(showNotification({
    //             message: state.message,
    //             type: state.state == ERequestState.success ? "success" : state.state == ERequestState.error ? "error" : "warning"
    //         }));
    //     }

    //     if (state.state === ERequestState.success && state.user) {
    //         redirect("/");
    //     }

    //     setIsLoading(null)
    // }, [state.message])

    const { mutate, isPending } = useMutation({
        mutationFn: getUserAlt,
        onSuccess: (data) => {
            dispatch(showNotification({
                message: data.message,
                type: data.state == ERequestState.success ? "success" : data.state == ERequestState.error ? "error" : "warning"
            }));

            if (data.state === ERequestState.success && data.user) {
                redirect("/");
            }
        },
    })

    return (
        <>
            <div className='flex w-full h-full bg-base-soft flex-col'>
                <header className='flex justify-start p-7 relative'>
                    <div className='group'>
                        <Logo />

                        <div className='absolute hidden w-auto h-auto p-2 px-5 transition-all justify-center items-center bg-white/70 shadow-md -bottom-2 left-4 group-hover:flex'>
                            <p className='text-center text-text-2/50 text-xs'>Back to Shop.</p>
                        </div>
                    </div>
                </header>

                <section className='flex justify-center items-center flex-col gap-5 w-full h-full relative'>
                    <div className='absolute top-10'>
                        <FaUser className='w-32 h-32 text-main-third' />
                    </div>

                    <form name='login' action={(data) => mutate(data)} className='flex flex-col gap-3'>
                        <Input.Root className='w-72 rounded-sm'>
                            <Input.Input type='email' name='email' placeholder='Email' />
                        </Input.Root>

                        <Input.Root className='w-72 rounded-sm'>
                            <Input.Input type='password' name='password' placeholder='Password' />
                        </Input.Root>

                        <Button.Root type="submit" hasbg className='w-full py-3 rounded-sm'>
                            <Button.Text text='Login' />
                        </Button.Root>
                    </form>

                    <div>
                        <p>Ainda não tens uma conta? <Link href={"/registration"} className='underline hover:text-main-third'>Junta-se a nós</Link></p>
                    </div>
                </section>
            </div>
            <Loading isPedding={isPending} />
        </>
    );
};

export default Login;
