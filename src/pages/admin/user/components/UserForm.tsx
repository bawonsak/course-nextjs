'use client'

import { UserInterface } from '@/interfaces'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'

type Props = {
  user?: UserInterface
}

const UserForm = ({ user }: Props) => {
  const router = useRouter()
  const [formData, setFormData] = useState<UserInterface>({
    id: user?.id || 0,
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    role: user?.role || 'user'
  })

  const handleSaveUser = async () => {
    if (!formData.name || !formData.email) {
      Swal.fire({
        title: 'แจ้งเตือน!',
        text: 'กรุณากรอกข้อมูลให้ครบถ้วน',
        icon: 'warning',
        confirmButtonText: 'ตกลง'
      })
      return
    }

    const res = await fetch('/api/user', {
      method: 'POST',
      body: JSON.stringify(formData)
    })

    if (res.ok) {
      Swal.fire({
        title: 'สำเร็จ',
        text: 'บันทึกข้อมูลเรียบร้อยแล้ว',
        icon: 'success',
        confirmButtonText: 'ปิด'
      }).then(result => {
        if (result.isConfirmed) {
          router.push('/admin/user')
        }
      })
    } else {
      Swal.fire({
        title: 'เกิดข้อผิดพลาด!',
        text: 'ไม่สามารถบันทึกข้อมูลได้',
        icon: 'error',
        confirmButtonText: 'ปิด'
      })
    }
  }

  return (
    <div>
      <div className='w-lg mb-4'>
        <input
          type='text'
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          placeholder='ชื่อ - นามสกุล'
          className='border p-2 rounded w-full mb-4'
        />
      </div>
      <div className='w-lg mb-4'>
        <input
          type='email'
          value={formData.email}
          onChange={e => setFormData({ ...formData, email: e.target.value })}
          placeholder='อีเมล'
          className='border p-2 rounded w-full mb-4'
        />
      </div>
      {!user ? (
        <>
          <div className='w-lg mb-4'>
            <input
              type='password'
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              placeholder='รหัสผ่าน'
              className='border p-2 rounded w-full mb-4'
            />
          </div>
        </>
      ) : null}

      <div className='w-lg mb-4'>
        <select
          value={formData.role}
          onChange={e => setFormData({ ...formData, role: e.target.value })}
          className='border p-2 rounded w-full mb-4'
        >
          <option value='user'>User</option>
          <option value='vip'>Vip</option>
          <option value='admin'>Admin</option>
        </select>
      </div>
      <div className='w-lg mb-4'>
        <button className='bg-blue-500 text-white p-2 rounded cursor-pointer' onClick={handleSaveUser}>
          บันทึก
        </button>
        <button
          className='bg-red-500 text-white p-2 rounded ml-2 cursor-pointer'
          onClick={() => router.push('/admin/user')}
        >
          ยกเลิก
        </button>
      </div>
    </div>
  )
}

export default UserForm
