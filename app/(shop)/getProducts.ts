import { baseURL } from "@/app/config";

export const getProducts = async () => {
    try {
        // await new Promise((res, rej) => setTimeout(() => res(true), 2000)) //sleep 2s

        const res = await fetch("/api/get-products", {
            method: "GET",
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        console.log("Fetching data");
        const data = await res.json();
        console.log(data);
        return data?.products;
    } catch (error) {
        console.error("Error fetching data");
        console.error(error);
        throw new Error("Error fetching data");
    }
}
