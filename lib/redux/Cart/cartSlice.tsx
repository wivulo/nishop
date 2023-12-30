import { iProduct } from '@/app/models/iProduct';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { iCart, iCartProduct } from "@/app/models/icart"
import { getQuantity } from './getQuantity';
import { getTotalPrices } from './getTotal';

const initialState: iCart = {
    products: [],
    quantity: 0,
    total: 0,
    showCart: false
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addProduct: (state, { payload: product }) => {

            let match = state.products.filter(pro => pro.product.id === product.id)
            if (match.length) {
                state.products.map(pro => {
                    if (pro.product.id === match[0].product.id) pro.quatity += 1
                })
            } else {
                state.products.push({
                    product: product,
                    quatity: getQuantity(state.products, product.id) + 1
                });
            }
            state.quantity += 1;
            state.total += product.price;
        },
        removeProduct: (state, { payload }) => {
            let productRemoved = state.products.filter(pro => pro.product.id == payload.id) 
            state.products = state.products.filter(pro => pro.product.id != productRemoved[0].product.id)
            state.quantity -= productRemoved[0].quatity;
            state.total = getTotalPrices(state.products)
        },
        increaseQuantityPerProduct: (state, { payload }) => {
            state.products = state.products.map(p => {
                if(p.product.id == payload.id) p.quatity += 1
                return p
            })

            state.quantity += 1
            state.total = getTotalPrices(state.products)
        },
        decreaseQuantityPerProduct: (state, { payload }) => {
            state.products = state.products.map(p => {
                if(p.product.id == payload.id) p.quatity -= 1
                return p
            })

            state.products = state.products.filter(p => p.quatity != 0)

            state.quantity -= 1
            state.total = getTotalPrices(state.products)
        },
        showCart: (state) => {
            state.showCart = true;
        },
        hideCart: (state) => {
            state.showCart = false;
        },
        clearCart: (state) => { },
    },
});

export const {
    addProduct,
    removeProduct,
    increaseQuantityPerProduct,
    decreaseQuantityPerProduct,
    clearCart,
    showCart,
    hideCart
} = cartSlice.actions;
export default cartSlice.reducer;
