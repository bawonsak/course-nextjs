'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { UserInterface } from '@/interfaces'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons'

const UserList = () => {
  const [users, setUsers] = useState<UserInterface[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
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
    fetchData() 
  }, [])

  return (
    <div>
      <h1 className='mb-4'>รายชื่อผู้ใช้งาน</h1>
      {loading ? <div>Loading...</div> : <>
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
              <th className='w-12 border border-gray-300 p-4 text-left font-semibold text-gray-900 dark:border-gray-600 dark:text-gray-200'>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {users.map((item: UserInterface, index: number) => {
              return <tr key={index}>
                <td className='border border-gray-300 p-4 text-gray-500 dark:border-gray-700 dark:text-gray-400'>{item.name}</td>
                <td className='border border-gray-300 p-4 text-gray-500 dark:border-gray-700 dark:text-gray-400'>{item.email}</td>
                <td className='border border-gray-300 p-4 text-gray-500 dark:border-gray-700 dark:text-gray-400'>{item.role}</td>
                <td className='border border-gray-300 p-4 text-gray-500 dark:border-gray-700 dark:text-gray-400 items-center'>
                    <button className='mr-2 text-blue-500 hover:text-blue-700 cursor-pointer'>
                      <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                    <button className='text-red-500 hover:text-red-700 cursor-pointer'>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>   
                </td>
              </tr>
            })}
          </tbody>
        </table>
      </>}
      
    </div>
  )
}

export default UserList
