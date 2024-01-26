import { apiLogout } from "@/app/config";

export const logout = async () => {
    await new Promise((res, rej) => setTimeout(() => res(true), 2000)) //sleep 5s
    
    const res = await fetch(apiLogout);
    if(!res.ok){
        throw new Error("Failed to logout!");
    }

    return res.json();
};