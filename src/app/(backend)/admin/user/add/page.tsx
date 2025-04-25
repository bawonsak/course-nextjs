import AddUserPage from '@/views/admin/user/AddUser'

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'เพิ่มผู้ใช้งาน'
}

const Page = () => {
  return <AddUserPage />
}

export default Page
