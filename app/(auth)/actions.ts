"use server";

import { cookies } from "next/headers";
import prisma from '@/lib/prisma/prisma';
import { ERequestState } from '@/app/models/eRequestState';
import { registrationValidator } from "./validator";

export async function createUser(formData: FormData) {
    if (registrationValidator(formData)) {
        const match = await prisma.user.findUnique({
            where: {
                email: formData.get("email") as string
            }
        })

        if (match) {
            return {
                state: ERequestState.warning,
                message: "Email already in use",
                user: null,
            }
        }

        const user = await prisma.user.create({
            data: {
                name: formData.get("name") as string,
                email: formData.get("email") as string,
                password: formData.get("password") as string,
            },
        }).catch(async () => {
            await prisma.$disconnect()
        })

        await prisma.$disconnect()

        return {
            state: ERequestState.success,
            message: "User created",
            user: user,
        }
    }else{
        return {
            state: ERequestState.error,
            message: "Please don't send empty filds!",
            user: null,
        }
    }
}

export async function getUser(prevState: any, data: FormData) {
    await new Promise((res, rej) => setTimeout(() => res(true), 2000)) //sleep 5s

    const match = await prisma.user.findUnique({
        where: {
            email: data.get("email") as string,
            password: data.get("password") as string
        }
    }).catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })

    //await prisma.$disconnect()

    if (!match) {
        return {
            state: ERequestState.error,
            message: "Email or Password wrong! Please, try again",
            user: null,
        }
    }

    cookies().set("user", JSON.stringify(match), { path: "/" });

    return {
        state: ERequestState.success,
        message: "Logged",
        user: match,
    }
}

export async function getUserAlt(data: FormData) {
    await new Promise((res, rej) => setTimeout(() => res(true), 2000)) //sleep 5s

    console.log(data);

    const match = await prisma.user.findUnique({
        where: {
            email: data.get("email") as string,
            password: data.get("password") as string
        }
    }).catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })

    //await prisma.$disconnect()

    if (!match) {
        return {
            state: ERequestState.error,
            message: "Email or Password wrong! Please, try again",
            user: null,
        }
    }

    cookies().set("user", JSON.stringify(match), { path: "/" });

    return {
        state: ERequestState.success,
        message: "Logged",
        user: match,
    }
}