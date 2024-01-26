import { apiLogout } from "@/app/config";

export const logout = async () => {
    const res = await fetch(apiLogout);
    if(!res.ok){
        throw new Error("Failed to logout!");
    }

    return res.json();
};