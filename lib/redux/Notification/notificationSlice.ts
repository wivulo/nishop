import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface iNotificationSlice {
    notifications: Array<iNotification>,
    isOpen: boolean
}

interface iNotification {
    id?: number,
    message: string,
    type?: string,
}

const initialState: iNotificationSlice = {
    notifications: [] as iNotification[],
    isOpen: false
};

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        showNotification: (state, action:PayloadAction<iNotification>) => {
            if (action.payload.message) {
                state.notifications.push({
                    id: state.notifications.length + 1,
                    ...action.payload
                });
                state.isOpen = true;
            }
        },

        hideNotification: (state) => {
            state.notifications = [];
            state.isOpen = false;
        }
    },
});

export const { showNotification, hideNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
