import { iProduct } from "@/app/models/iProduct"

export const addProductToDB = async (product: iProduct) => {
    const isAdd = await fetch('http://localhost:3000/api/add-product', {
        method: 'POST',
        body: JSON.stringify(product),
    })
    .then((res) => {
        return res.json();
    })
    .catch((e) => {
        console.error(e);
    });

    return isAdd.product ? true : false;
}