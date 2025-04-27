'use client'

import { CartInterface, CartItemInterface } from '@/interfaces'
import {
  Box,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import Image from 'next/image'
import axios from 'axios'
import { useEffect, useState } from 'react'

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItemInterface[]>([])
  const [grandTotal, setGrandTotal] = useState<number>(0)

  const getUserCart = async () => {
    try {
      const { data } = await axios.get<CartInterface>('/api/cart')
      setCartItems(data.CartItems || [])

      if (data.CartItems) {
        let sumTotal = 0

        for (let i = 0; i < data.CartItems.length; i++) {
          const item = data.CartItems[i]
          sumTotal += item.Product.price * item.qty
        }

        setGrandTotal(sumTotal)
      }
    } catch {}
  }

  const numberWithCommas = (x: number) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  useEffect(() => {
    getUserCart()
  }, [])

  return (
    <Container maxWidth='xl' className='mt-8'>
      <Typography variant='h5'>ตะกร้าสินค้า</Typography>
      <TableContainer component={Paper} className='mt-6'>
        <Table sx={{ minWidth: 650 }} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell width={50}></TableCell>
              <TableCell>ชื่อสินค้า</TableCell>
              <TableCell align='right'>ราคา</TableCell>
              <TableCell align='right'>จำนวน</TableCell>
              <TableCell align='right'>รวม</TableCell>
              <TableCell align='center'></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cartItems.map(item => (
              <TableRow key={item.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      overflow: 'hidden'
                    }}
                  >
                    {item.Product.image && (
                      <Image
                        src={item.Product.image}
                        width={50}
                        height={50}
                        style={{ objectFit: 'cover' }}
                        alt={item.Product.name}
                      />
                    )}
                  </Box>
                </TableCell>
                <TableCell>{item.Product.name}</TableCell>
                <TableCell align='right'>{numberWithCommas(item.Product.price)}</TableCell>
                <TableCell align='right'>{item.qty}</TableCell>
                <TableCell align='right'>{numberWithCommas(item.Product.price * item.qty)}</TableCell>
                <TableCell align='center'></TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4} align='right'>
                <span className='text-xl font-bold'>ยอดรวม</span>
              </TableCell>
              <TableCell align='right'>
                <span className='text-xl font-bold'>{numberWithCommas(grandTotal)}</span>
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Container>
  )
}

export default CartPage
