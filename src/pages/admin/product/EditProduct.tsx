import { ProductInterface } from '@/interfaces'
import ProductForm from './components/ProductForm'

type Props = {
  product: ProductInterface
}

const EditProductPage = ({ product }: Props) => {
  return (
    <div className='container mx-auto mt-4'>
      <div className='mb-4'>
        <h1>แก้ไขสินค้า</h1>
      </div>
      <ProductForm product={product} />
    </div>
  )
}

export default EditProductPage
