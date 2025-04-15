import NavbarAdmin from '@/components/layouts/NavbarAdmin'
import { ChildrenType } from '@/types'

const AdminLayout = ({ children }: ChildrenType) => {
  return (
    <div className='flex flex-col min-h-screen'>
      <NavbarAdmin />
      <main className='flex-grow p-4'>{children}</main>
    </div>
  )
}
export default AdminLayout
