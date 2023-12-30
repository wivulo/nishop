import { iProduct } from "./iProduct";

export interface iCartProduct{
    product: iProduct;
    quatity: number;
}

export interface iCart {
    products: iCartProduct[];
    quantity: number;
    total: number;
    showCart: boolean;
}