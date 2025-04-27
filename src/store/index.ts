// Third-party Imports
import { configureStore } from '@reduxjs/toolkit'

// Slice Imports
import cartReducer from '@/store/slices/cart'


export const store = configureStore({
  reducer: {
    cartReducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false })
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
