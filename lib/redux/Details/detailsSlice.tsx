import { iProduct } from '@/app/models/iProduct';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DetailState {
    product: iProduct;
    isOpen: boolean;
}

const initialState: DetailState = {
    product: {} as iProduct,
    isOpen: false,
};

const detailSlice = createSlice({
    name: 'detail',
    initialState,
    reducers: {
        openDetail: (state, action: PayloadAction<iProduct>) => {
            state.product = action.payload;
            state.isOpen = true;
        },
        closeDetail: (state) => {
            state.isOpen = false;
            state.product = {} as iProduct;
        }
    },
});

export const { openDetail, closeDetail } = detailSlice.actions;
export default detailSlice.reducer;
