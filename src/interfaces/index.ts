export interface UserInterface {
  id: number
  name: string
  email: string
  password?: string
  image?: string
  role: string
  createdAt?: Date
  updatedAt?: Date
}

export interface ProductInterface {
  id: number
  name: string
  brandId: number
  Brand?: BrandInterface
  createdAt?: Date
  updatedAt?: Date
  image?: string
  base64Image?: string
  price: number
}

export interface BrandInterface {
  id: number
  name: string
  createdAt?: Date
  updatedAt?: Date
  products?: ProductInterface[]
}

export interface CartInterface {
  id: number
  userId: number
  status: string
  createdAt: Date
  updatedAt?: Date
  CartItems?: CartItemInterface[]
}

export interface  CartItemInterface {
  id: number
  cartId: number
  deleted: boolean
  qty: number
  Product: ProductInterface
}