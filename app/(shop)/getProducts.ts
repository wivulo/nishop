import { baseURL } from "@/app/config";

export const getProducts = async () => {
    const res = await fetch(baseURL + "api/get-products", {
        method: "GET",
    });
    if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    // console.log(data);
    return data.products;
}
