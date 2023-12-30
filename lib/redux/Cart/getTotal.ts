import { iCart, iCartProduct } from "@/app/models/icart";
import { parentPort } from "worker_threads";

export const getTotalPrices = (cartItems: iCartProduct[]) => {
    return cartItems.map(product => {
        return product.product.price * product.quatity
    }).reduce((prev, curr) => prev += curr, 0)
}