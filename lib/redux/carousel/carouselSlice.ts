import { createSlice } from "@reduxjs/toolkit"

const carouselSlice = createSlice({
    name: "carousel",
    initialState: {
        scrollleft: 0
    },
    reducers: {
        increase: (state, { payload }) => {
            if (state.scrollleft < 0) state.scrollleft = 0;

            state.scrollleft += payload.scroll
        },

        decrease: (state, { payload }) => {
            if (state.scrollleft > 0) state.scrollleft = -1;

            state.scrollleft -= payload.scroll
        }
    }
})

export const {increase, decrease} = carouselSlice.actions

export default carouselSlice.reducer