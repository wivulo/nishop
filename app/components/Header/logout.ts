import Cookies from "js-cookie";
import { revalidatePath } from "next/cache";

export const logout = async () => {
    Cookies.remove("user");
    
    return true;
};