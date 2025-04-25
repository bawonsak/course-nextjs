import LoginPage from '@/views/auth/LoginPage'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'เข้าสู่ระบบ'
}

const Page = () => {
  return <LoginPage />
}

export default Page
