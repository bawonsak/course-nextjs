'use client'

import { BrandInterface, ProductInterface } from '@/interfaces'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import { Button, Grid, MenuItem, styled, TextField } from '@mui/material'
import axios from 'axios'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloudUpload } from '@fortawesome/free-solid-svg-icons'
import { getProductImage } from '@/libs'

type Props = {
  product?: ProductInterface
}

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
})

const UserForm = ({ product }: Props) => {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)
  const [brands, setBrands] = useState<BrandInterface[]>([])
  const [formData, setFormData] = useState<ProductInterface>({
    id: product?.id || 0,
    name: product?.name || '',
    brandId: product?.brandId || 0
  })

  const [preview, setPreview] = useState<string | null>(null)

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

  const handleSaveProduct = async () => {
    if (!formData.name) {
      Swal.fire({
        title: 'แจ้งเตือน!',
        text: 'กรุณากรอกข้อมูลให้ครบถ้วน',
        icon: 'warning',
        confirmButtonText: 'ตกลง'
      })
      return
    }

    try {
      if (product) {
        axios.post(`/api/product/${product.id}`, formData)
      } else {
        axios.post(`/api/product`, formData)
      }

      Swal.fire({
        title: 'สำเร็จ',
        text: 'บันทึกข้อมูลเรียบร้อยแล้ว',
        icon: 'success',
        confirmButtonText: 'ปิด'
      }).then(result => {
        if (result.isConfirmed) {
          router.push('/admin/product')
        }
      })
    } catch {
      Swal.fire({
        title: 'เกิดข้อผิดพลาด!',
        text: 'ไม่สามารถบันทึกข้อมูลได้',
        icon: 'error',
        confirmButtonText: 'ปิด'
      })
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]

    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile)
      setPreview(objectUrl)

      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData({ ...formData, base64Image: reader.result as string })
      }
      reader.readAsDataURL(selectedFile) // แปลงเป็น base64
    }
  }

  return (
    <div className='container max-w-3xl mx-auto p-4'>
      {loading ? (
        <>Loading</>
      ) : (
        <>
          <Grid container spacing={2}>
            <Grid size={12}>
              <TextField
                label='ชื่อสินค้า'
                variant='outlined'
                fullWidth
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                label='แบรนด์'
                variant='outlined'
                fullWidth
                select
                value={formData.brandId}
                onChange={e => setFormData({ ...formData, brandId: Number(e.target.value) })}
              >
                <MenuItem value='0'>
                  <em>ไม่ระบุ</em>
                </MenuItem>
                {brands.map(brand => (
                  <MenuItem key={brand.id} value={brand.id}>
                    {brand.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={12}>
              <Button
                component='label'
                role={undefined}
                variant='contained'
                tabIndex={-1}
                startIcon={<FontAwesomeIcon icon={faCloudUpload} />}
              >
                Upload files
                <VisuallyHiddenInput type='file' onChange={handleFileChange} accept='image/*' />
              </Button>
              {preview ? (
                <div className='mt-4'>
                  <Image src={preview} alt='Preview' className='rounded border shadow' width={100} height={100} />
                </div>
              ) : (
                <>
                  {product?.image && (
                    <div className='mt-4'>
                      <Image
                        src={getProductImage(product.image)}
                        alt='Uploaded'
                        className='rounded border shadow'
                        width={100}
                        height={100}
                      />
                    </div>
                  )}
                </>
              )}
            </Grid>
            <Grid size={12}>
              <div className='flex gap-4'>
                <Button variant='contained' color='primary' onClick={handleSaveProduct} className='w-full'>
                  บันทึกข้อมูล
                </Button>
                <Button
                  variant='outlined'
                  color='secondary'
                  onClick={() => router.push('/admin/product')}
                  className='w-full mt-2'
                >
                  ยกเลิก
                </Button>
              </div>
            </Grid>
          </Grid>
        </>
      )}
    </div>
  )
}

export default UserForm
