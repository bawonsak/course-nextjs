import ProductDetail from '@/views/product/ProductDetail'
import axios from 'axios'
import { notFound } from 'next/navigation'

const Page = async ({ params }) => {
  const { id } = await params
  // ดึงค่า id จาก params

  try {
    // ยิง request ไปที่ API
    // โดยใช้ axios.get
    // โดยใช้ id ที่ได้จาก params
    // และ return ค่า product ที่ได้จาก API
    // โดยใช้ ProductDetail component
    // โดยใช้ props เป็น product
    // โดยใช้ await  
    const { data } = await axios.get(`https://dummyjson.com/products/${id}`)
    return <ProductDetail product={data} />
  } catch {
    // ถ้าเกิด error ให้ return notFound
    // โดยใช้ notFound() function
    notFound();
  }

  
}

export default Page
