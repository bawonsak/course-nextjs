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