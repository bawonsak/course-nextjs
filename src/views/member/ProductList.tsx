'use client'

import { BrandInterface, ProductInterface } from '@/interfaces'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  Container,
  Grid,
  MenuItem,
  Pagination,
  TextField,
  Typography
} from '@mui/material'
import axios from 'axios'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { getCart } from '@/store/slices/cart'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '@/store'

type ProductType = {
  items: ProductInterface[]
  total: number
  page: number
  limit: number
  totalPages: number
}

const ProductList = () => {
  const [brands, setBrands] = useState<BrandInterface[]>([])
  const [selectedBrand, setSelectedBrand] = useState<number>(0)
  const [keyword, setKeyword] = useState<string>('')
  const [initial, setInitial] = useState<boolean>(false)
  const [products, setProducts] = useState<ProductInterface[]>([])
  const [page, setPage] = useState<number>(1)
  const [limit] = useState<number>(10)
  const [totalPages, setTotalPages] = useState(0)
  const debounceRef = useRef<NodeJS.Timeout | null>(null) // 👈 เก็บ timer ไว้ใน ref
  const [loading, setLoading] = useState(false)
  const dispatch: AppDispatch = useDispatch()

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true)
      const { data } = await axios.get<ProductType>('/api/product', {
        params: {
          brandId: selectedBrand,
          keyword: keyword,
          page: page,
          limit: limit
        }
      })
      setProducts(data.items)
      setPage(data.page)
      setTotalPages(data.totalPages)
      setLoading(false)
    } catch {
      setLoading(false)
    }
  }, [selectedBrand, page, limit, keyword])

  const fetchBrand = async () => {
    try {
      const { data } = await axios.get<BrandInterface[]>('/api/brand')
      setBrands(data)
      setInitial(true)
    } catch {}
  }

  const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value)
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // ถ้ามี debounce เดิมอยู่ ให้เคลียร์ทิ้งก่อน
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    // ตั้ง debounce ใหม่
    debounceRef.current = setTimeout(() => {
      setKeyword(event.target.value.toLowerCase())
      setPage(1) // reset หน้าเมื่อค้นหาใหม่
    }, 300) // 300ms
  }

  const addToCart = async (product: ProductInterface) => {
    try {
      await axios.post('/api/cart', {
        productId: product.id,
        qty: 1
      })

      toast('เพิ่มสินค้าไปยังตะกร้าแล้ว')
      dispatch(getCart())
    } catch {}
  }

  useEffect(() => {
    fetchBrand()
  }, [])

  useEffect(() => {
    if (initial) {
      fetchProduct()
    }
  }, [fetchProduct, initial])

  return (
    <Container maxWidth='xl' className='mt-8'>
      <Grid container spacing={2}>
        <Grid size={{ lg: 2, sm: 3, xs: 12 }}>
          <TextField
            id='outlined-select-currency'
            select
            label='แบรนด์'
            value={selectedBrand}
            onChange={e => setSelectedBrand(Number(e.target.value))}
            fullWidth
            size='small'
          >
            <MenuItem value={0}>ทั้งหมด</MenuItem>
            {brands.map(brand => (
              <MenuItem key={brand.id} value={brand.id}>
                {brand.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={{ lg: 10, sm: 9, xs: 12 }}>
          <TextField label='คำค้นหา' variant='outlined' fullWidth size='small' onChange={handleInputChange} />
        </Grid>
      </Grid>
      {loading ? (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
            <CircularProgress />
          </Box>
        </>
      ) : (
        <>
          <div className='mt-10 mb-10'>
            {products.length > 0 ? (
              <>
                <Grid container spacing={4}>
                  {products.map(product => (
                    <Grid key={product.id} size={{ xs: 12, sm: 6, md: 3 }}>
                      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                        <CardMedia
                          component='img'
                          height='200'
                          image={product.image}
                          alt={product.name}
                          sx={{
                            height: 300,
                            objectFit: 'cover', // ตัดภาพให้พอดีกับกรอบ
                            width: '100%',
                            borderTopLeftRadius: 12,
                            borderTopRightRadius: 12
                          }}
                        />
                        <CardContent>
                          <Typography
                            gutterBottom
                            variant='h6'
                            component='div'
                            className='truncate'
                            title={product.name}
                          >
                            {product.name}
                          </Typography>
                          <Typography variant='body2' color='text.secondary'>
                            {product.Brand?.name || '-'}
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <Button variant='contained' fullWidth onClick={() => addToCart(product)}>
                            เพิ่มไปยังตะกร้า
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    size='large'
                    onChange={handleChangePage}
                    color='primary'
                    shape='rounded'
                  />
                </Box>
              </>
            ) : (
              <>
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography variant='h6' color='text.secondary'>
                    ไม่พบสินค้า
                  </Typography>
                </Box>
              </>
            )}
          </div>
        </>
      )}
    </Container>
  )
}

export default ProductList
