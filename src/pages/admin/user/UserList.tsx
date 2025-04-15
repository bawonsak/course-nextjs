'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { UserInterface } from '@/interfaces'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'

const UserList = () => {
  const router = useRouter()
  const [users, setUsers] = useState<UserInterface[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const fetchData = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get('/api/user')
      setUsers(data)
      setLoading(false)
    } catch {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleDelete = async (user: UserInterface) => {
    Swal.fire({
      title: 'ยืนยัน',
      text: `คุณต้องการลบผู้ใช้งาน ${user.name} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'ใช่, ลบเลย!',
      cancelButtonText: 'ยกเลิก'
    }).then(async result => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`/api/user/${user.id}`)

          fetchData()

          Swal.fire({
            title: 'สำเร็จ',
            text: 'ลบผู้ใช้งานเรียบร้อยแล้ว',
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
        <h1>รายชื่อผู้ใช้งาน</h1>
        <button
          className='bg-blue-500 text-white p-2 rounded cursor-pointer'
          onClick={() => router.push('/admin/user/add')}
        >
          เพิ่มผู้ใช้งาน
        </button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <table className='w-full border-collapse border border-gray-400 bg-white text-sm dark:border-gray-500 dark:bg-gray-800'>
            <thead className='bg-gray-50 dark:bg-gray-700'>
              <tr>
                <th className='border border-gray-300 p-4 text-left font-semibold text-gray-900 dark:border-gray-600 dark:text-gray-200'>
                  ชื่อ - นามสกุล
                </th>
                <th className='border border-gray-300 p-4 text-left font-semibold text-gray-900 dark:border-gray-600 dark:text-gray-200'>
                  อีเมล
                </th>
                <th className='border border-gray-300 p-4 text-left font-semibold text-gray-900 dark:border-gray-600 dark:text-gray-200'>
                  สิทธิ์
                </th>
                <th className='w-12 border border-gray-300 p-4 text-left font-semibold text-gray-900 dark:border-gray-600 dark:text-gray-200'>
                  จัดการ
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((item: UserInterface, index: number) => {
                return (
                  <tr key={index}>
                    <td className='border border-gray-300 p-4 text-gray-500 dark:border-gray-700 dark:text-gray-400'>
                      {item.name}
                    </td>
                    <td className='border border-gray-300 p-4 text-gray-500 dark:border-gray-700 dark:text-gray-400'>
                      {item.email}
                    </td>
                    <td className='border border-gray-300 p-4 text-gray-500 dark:border-gray-700 dark:text-gray-400'>
                      {item.role}
                    </td>
                    <td className='border border-gray-300 p-4 text-gray-500 dark:border-gray-700 dark:text-gray-400 items-center'>
                      <button className='mr-2 text-blue-500 hover:text-blue-700 cursor-pointer'>
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </button>
                      <button
                        className='text-red-500 hover:text-red-700 cursor-pointer'
                        onClick={() => handleDelete(item)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </>
      )}
    </div>
  )
}

export default UserList
