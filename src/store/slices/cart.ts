// Third-party Imports
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

export const getCart = createAsyncThunk('cart/get', async () => {
  let totalQty = 0
  try {
    const { data } = await axios.get('/api/cart')
    totalQty = data.CartItems.reduce((sum: number, item: { qty: number; }) => sum + item.qty, 0);
  } catch {}
  
  return totalQty
})

// Constants
const initialState = {
  countItem: 0
}

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getCart.fulfilled, (state, action) => {
      if (action.payload) {
        state.countItem = action.payload
      }
    })
  }
})

export const {} = cartSlice.actions

export default cartSlice.reducer
