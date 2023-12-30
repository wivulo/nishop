import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface iNotification {
    message: string,
    isOpen: boolean
}

const initialState: iNotification = {
    message: "",
    isOpen: false
};

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        showNotification: (state, action) => {
            state.message = action.payload;
            state.isOpen = true;
        },

        hideNotification: (state) => {
            state.message = "";
            state.isOpen = false;
        }
    },
});

export const { showNotification, hideNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
