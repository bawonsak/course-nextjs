import { ChildrenType } from '@/types'
import Navbar from '@/components/layouts/Navbar'

const ApplicationLayout = ({ children }: ChildrenType) => {
  return (
    <div className='flex flex-col min-h-screen'>
      <Navbar />
      <main className='flex-grow p-4'>{children}</main>
      <footer className='bg-gray-800 text-white p-4 text-center'>&copy; 2025 Your Company</footer>
    </div>
  )
}

export default ApplicationLayout
