/* Core */
import { configureStore, type ThunkAction, type Action } from '@reduxjs/toolkit'
import carouselSlice from './carousel/carouselSlice'
import detailsSlice from './Details/detailsSlice'
import notificationSlice from './Notification/notificationSlice'

export const reduxStore = configureStore({
  reducer: {
    carousel: carouselSlice,
    details: detailsSlice,
    notification: notificationSlice
  },
})


/* Types */
export type ReduxStore = typeof reduxStore
export type ReduxState = ReturnType<typeof reduxStore.getState>