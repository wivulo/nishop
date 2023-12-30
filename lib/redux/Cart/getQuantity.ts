import { iCartProduct } from "@/app/models/icart"

export const getQuantity = (products: iCartProduct[], id: number) => {
    let target = products.filter(product => product.product.id == id)

    return target.length
}