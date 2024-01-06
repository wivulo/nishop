import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface iShoppingBag {
    inView: boolean;
}

const initialState: iShoppingBag = {
    inView: true
};

const iShoppingBagSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        setIsInView: (state, action) => {
            console.log(state.inView)
            state.inView = action.payload
        },
    },
});

export const { setIsInView,  } = iShoppingBagSlice.actions;
export default iShoppingBagSlice.reducer;
