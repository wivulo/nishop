import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { iUser } from "@/app/models/iUser"
import { cookies } from 'next/headers';

interface User extends iUser{
    id: number;
}

interface iUserSlice{
    user: User;
    logged: boolean;
}

const initialState: iUserSlice = {
    user: {
        id: 0,
        name: '',
        email: '',
        password: '',
    },
    logged: false
};

const User = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, {payload}: PayloadAction<User>) => {
            state.user = {id: payload.id ,name: payload.name, email: payload.email, password: payload.password}
            state.logged = true;
        },

        setUser: (state, {payload}: PayloadAction<User>) => {
            state.user = {id: payload.id ,name: payload.name, email: payload.email, password: payload.password}
            state.logged = true;
        },
        logout: (state) => {
            state.logged = false;
            state.user = {} as User;
        },
    },
});

export const { login,  setUser} = User.actions;
export default User.reducer;
