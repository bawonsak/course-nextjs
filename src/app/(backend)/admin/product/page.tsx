import ProductList from '@/pages/admin/product/ProductList'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'รายชื่อสินค้า'
}

const Page = () => {
  return <ProductList />
}

export default Page
