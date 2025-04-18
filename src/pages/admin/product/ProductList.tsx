'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { ProductInterface } from '@/interfaces'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons'
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
  Button
} from '@mui/material'
import Link from 'next/link'

const UserList = () => {
  const router = useRouter()
  const [products, setProducts] = useState<ProductInterface[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const fetchData = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get<ProductInterface[]>('/api/product')
      setProducts(data)
      setLoading(false)
    } catch {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

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

  return (
    <div>
      <div className='mb-4 flex items-center justify-between'>
        <h1>รายการสินค้า</h1>
        <Button variant='contained' LinkComponent={Link} href='/admin/product/add'>
          เพิ่มสินค้า
        </Button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label='simple table'>
              <TableHead>
                <TableRow>
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
