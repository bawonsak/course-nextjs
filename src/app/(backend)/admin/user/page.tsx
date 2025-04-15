import UserList from '@/pages/admin/user/UserList'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'รายชื่อผู้ใช้งาน'
}

const Page = () => {
  return <UserList />
}

export default Page
