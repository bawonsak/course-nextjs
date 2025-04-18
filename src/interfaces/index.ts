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
}

export interface BrandInterface {
  id: number
  name: string
  createdAt?: Date
  updatedAt?: Date
  products?: ProductInterface[]
}