/* Core */
import { configureStore, type ThunkAction, type Action } from '@reduxjs/toolkit'
import carouselSlice from './carousel/carouselSlice'

export const reduxStore = configureStore({
  reducer: {
    carousel: carouselSlice
  },
})


/* Types */
export type ReduxStore = typeof reduxStore
export type ReduxState = ReturnType<typeof reduxStore.getState>