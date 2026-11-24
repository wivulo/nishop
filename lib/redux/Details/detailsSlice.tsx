import { iProduct } from '@/app/models/iProduct';
import { Product } from '@prisma/client';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DetailState {
    product: Product | null;
    isOpen: boolean;
}

const initialState: DetailState = {
    product: null,
    isOpen: false,
};

const detailSlice = createSlice({
    name: 'detail',
    initialState,
    reducers: {
        openDetail: (state, action: PayloadAction<Product>) => {
            state.product = action.payload;
            state.isOpen = true;
        },
        closeDetail: (state) => {
            state.isOpen = false;
            state.product = null;
        }
    },
});

export const { openDetail, closeDetail } = detailSlice.actions;
export default detailSlice.reducer;
