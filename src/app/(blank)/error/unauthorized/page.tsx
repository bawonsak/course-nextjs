// components/PermissionDenied.tsx

import Link from 'next/link'

const PermissionDenied = () => {
  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <div className='bg-white p-8 rounded-2xl shadow-xl text-center max-w-md'>
        <h1 className='text-2xl font-semibold text-gray-800 mb-2'>Permission Denied</h1>
        <p className='text-gray-600 mb-6'>ขออภัย คุณไม่มีสิทธิ์ใช้งานส่วนนี้.</p>
        <Link
          href='/'
          className='inline-block px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition'
        >
          กลับสู่หน้าหลัก
        </Link>
      </div>
    </div>
  )
}

export default PermissionDenied
