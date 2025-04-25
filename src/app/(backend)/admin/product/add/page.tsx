import AddProductPage from '@/views/admin/product/AddProduct'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'เพิ่มสินค้า'
}

const Page = () => {
  return <AddProductPage />
}

export default Page
