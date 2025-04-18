import { ProductInterface } from '@/interfaces'
import EditProductPage from '@/pages/admin/product/EditProduct'
import axios from 'axios'
import { notFound } from 'next/navigation'

const fetchData = async (id: number): Promise<ProductInterface | null> => {
  try {
    const { data } = await axios.get(`${process.env.NEXTAUTH_URL}/api/product/${id}`)

    return data
  } catch {
    return null
  }
}

const Page = async (props: { params: Promise<{ id: number }> }) => {
  const params = await props.params
  const data = await fetchData(params.id)

  if (!data) {
    return notFound()
  }

  return <EditProductPage product={data} />
}

export default Page
