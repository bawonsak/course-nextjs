'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { BrandInterface, ProductInterface } from '@/interfaces'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Button,
  Grid,
  TextField,
  Card,
  CardContent,
  MenuItem,
  Box,
  Pagination
} from '@mui/material'
import Link from 'next/link'
import Image from 'next/image'
import { getProductImage } from '@/libs'

type ProductType = {
  items: ProductInterface[]
  total: number
  page: number
  limit: number
  totalPages: number
}

const ProductListList = () => {
  const router = useRouter()
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // response api
  const [products, setProducts] = useState<ProductInterface[]>([])
  const [page, setPage] = useState<number>(1)
  const [limit] = useState<number>(2)
  const [totalPages, setTotalPages] = useState(0)

  // filter
  const [loading, setLoading] = useState<boolean>(false)
  const [searchText, setSearchText] = useState('')
  const [keyword, setKeyword] = useState<string>('')
  const [brands, setBrands] = useState<BrandInterface[]>([])
  const [selectedBrand, setSelectedBrand] = useState<number>(0)

  const handleDelete = async (product: ProductInterface) => {
    Swal.fire({
      title: 'ยืนยัน',
      text: `คุณต้องการลบ ${product.name} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'ใช่, ลบเลย!',
      cancelButtonText: 'ยกเลิก'
    }).then(async result => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`/api/product/${product.id}`)

          setRefreshTrigger(prev => prev + 1)

          Swal.fire({
            title: 'สำเร็จ',
            text: 'ลบสินค้าเรียบร้อยแล้ว',
            icon: 'success',
            confirmButtonText: 'ปิด'
          })
        } catch {
          Swal.fire({
            title: 'เกิดข้อผิดพลาด!',
            text: 'ไม่สามารถลบข้อมูลได้',
            icon: 'error',
            confirmButtonText: 'ปิด'
          })
        }
      }
    })
  }

  const handlePageChange = (_: unknown, value: number) => {
    setPage(value)
  }

  const handleSearchClick = () => {
    setPage(1)
    setKeyword(searchText)
  }

  useEffect(() => {
    const getInitial = async () => {
      try {
        setLoading(true)
        const { data } = await axios.get<BrandInterface[]>('/api/brand')
        setBrands(data)
        setLoading(false)
      } catch {
        setLoading(false)
      }
    }

    getInitial()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const { data } = await axios.get<ProductType>('/api/product', {
          params: {
            keyword,
            brandId: selectedBrand,
            page,
            limit
          }
        })
        setProducts(data.items)
        setPage(data.page)
        setTotalPages(data.totalPages)
        setLoading(false)
      } catch {
        setProducts([])
        setPage(1)
        setTotalPages(0)
        setLoading(false)
      }
    }

    fetchData()
  }, [keyword, limit, page, selectedBrand, refreshTrigger])

  return (
    <div>
      <div className='mb-4 flex items-center justify-between'>
        <h1>รายการสินค้า</h1>
        <Button variant='contained' LinkComponent={Link} href='/admin/product/add'>
          เพิ่มสินค้า
        </Button>
      </div>
      <div className='mb-4'>
        <Card>
          <CardContent>
            <Grid container spacing={2}>
              <Grid size={6}>
                <TextField
                  label='คำค้นหา'
                  variant='outlined'
                  fullWidth
                  value={searchText}
                  onChange={e => setSearchText(e.target.value)}
                />
              </Grid>
              <Grid size={6}>
                <TextField
                  label='แบรนด์'
                  variant='outlined'
                  fullWidth
                  select
                  value={selectedBrand}
                  onChange={e => setSelectedBrand(Number(e.target.value))}
                >
                  <MenuItem value='0'>ทั้งหมด</MenuItem>
                  {brands.map(brand => (
                    <MenuItem key={brand.id} value={brand.id}>
                      {brand.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid size={12}>
                <div className='flex w-full justify-end gap-4'>
                  <Button variant='contained' color={'info'} onClick={handleSearchClick}>
                    ค้นหา
                  </Button>
                </div>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label='simple table'>
              <TableHead>
                <TableRow>
                  <TableCell width={100} align={'center'}></TableCell>
                  <TableCell>ชื่อสินค้า</TableCell>
                  <TableCell>แบรนด์</TableCell>
                  <TableCell width={100} align={'center'}>
                    จัดการ
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map(row => (
                  <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell component='th' scope='row'>
                      {row.image ? (
                        <div className='w-[56px] h-[56px] relative rounded overflow-hidden'>
                          <Image src={getProductImage(row.image)} alt={row.name} fill style={{ objectFit: 'cover' }} />
                        </div>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faImage} size={'4x'} color='#ccc' />
                        </>
                      )}
                    </TableCell>
                    <TableCell component='th' scope='row'>
                      {row.name}
                    </TableCell>
                    <TableCell>{row.Brand?.name || '-'}</TableCell>
                    <TableCell>
                      <IconButton color='primary' onClick={() => router.push(`/admin/product/${row.id}/edit`)}>
                        <FontAwesomeIcon icon={faPenToSquare} size='xs' />
                      </IconButton>
                      <IconButton color='error' onClick={() => handleDelete(row)}>
                        <FontAwesomeIcon icon={faTrash} size='xs' />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {totalPages > 1 ? (
            <Box display='flex' justifyContent='center' mt={4}>
              <Pagination count={totalPages} page={page} onChange={handlePageChange} color='primary' />
            </Box>
          ) : null}
        </>
      )}
    </div>
  )
}

export default ProductListList
