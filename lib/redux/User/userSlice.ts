import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { iUser } from "@/app/models/iUser"

const initialState: iUser = {
    name: '',
    email: '',
    password: '',
};

const User = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<iUser>) => {
            state.name = action.payload.name;
            state.email = action.payload.email;
            state.password = action.payload.password;
        }
    },
});

export const { login,  } = User.actions;
export default User.reducer;
