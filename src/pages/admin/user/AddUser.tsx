import UserForm from './components/UserForm'

const AddUserPage = () => {
  return (
    <div className='container mx-auto mt-4'>
      <div className='mb-4'>
        <h1>เพิ่มผู้ใช้งาน</h1>
      </div>
      <UserForm />
    </div>
  )
}

export default AddUserPage
