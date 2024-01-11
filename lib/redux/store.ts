/* Core */
import { configureStore, type ThunkAction, type Action } from '@reduxjs/toolkit'
import carouselSlice from './carousel/carouselSlice'
import detailsSlice from './Details/detailsSlice'
import notificationSlice from './Notification/notificationSlice'
import cartSlice from './Cart/cartSlice'
import shoppingBagSlice from './ShoppingBag/shoppingBagSlice'
import userSlice from './User/userSlice'

export const reduxStore = configureStore({
  reducer: {
    carousel: carouselSlice,
    details: detailsSlice,
    notification: notificationSlice,
    cart: cartSlice,
    shoppingBag: shoppingBagSlice,
    user: userSlice
  },
})


/* Types */
export type ReduxStore = typeof reduxStore
export type ReduxState = ReturnType<typeof reduxStore.getState>