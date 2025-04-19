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
  MenuItem
} from '@mui/material'
import Link from 'next/link'
import Image from 'next/image'

const UserList = () => {
  const router = useRouter()
  const [products, setProducts] = useState<ProductInterface[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [keyword, setKeyword] = useState<string>('')
  const [brands, setBrands] = useState<BrandInterface[]>([])
  const [selectedBrand, setSelectedBrand] = useState<number>(0)

  const fetchData = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get<ProductInterface[]>('/api/product', {
        params: {
          keyword,
          brandId: selectedBrand
        }
      })
      setProducts(data)
      setLoading(false)
    } catch {
      setLoading(false)
    }
  }

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

          fetchData()

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

    const getProducts = async () => {
      const { data } = await axios.get<ProductInterface[]>('/api/product')
      setProducts(data)
    }

    getInitial()
    getProducts()
  }, [])

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
                  value={keyword}
                  onChange={e => setKeyword(e.target.value)}
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
                  <Button variant='contained' color={'info'} onClick={() => fetchData()}>
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
                          <Image src={row.image} alt={row.name} layout={'fill'} objectFit={'cover'} />
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
        </>
      )}
    </div>
  )
}

export default UserList
