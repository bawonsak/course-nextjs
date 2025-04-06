import ProductDetail from '@/views/product/ProductDetail'
import axios from 'axios'
import { notFound } from 'next/navigation'

const Page = async ({ params }) => {
  const { id } = await params

  try {
    const { data } = await axios.get(`https://dummyjson.com/products/${id}`)
    return <ProductDetail product={data} />
  } catch {
    notFound();
  }

  
}

export default Page
