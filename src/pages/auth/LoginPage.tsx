'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { signIn } from 'next-auth/react'

const LoginPage = () => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState<string>('')
  const router = useRouter()

  const handleLogin = async () => {
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password
      })

      if (result?.ok) {
        router.push('/profile')
      } else {
        setError(result?.error || 'Login failed')
      }
    } catch (err) {
      console.log('error', err)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100 px-4'>
      <div className='w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6'>
        <h2 className='text-2xl font-bold text-center text-gray-800'>Welcome</h2>
        <div className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700'>Username</label>
            <input
              type='text'
              placeholder='yourusername'
              className='mt-1 w-full px-4 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none'
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>Password</label>
            <input
              type='password'
              placeholder='••••••••'
              className='mt-1 w-full px-4 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none'
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <button
            type='submit'
            className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-xl transition duration-300'
            onClick={() => handleLogin()}
          >
            Sign In
          </button>
          {error && <p className='text-red-500 text-sm text-center'>{error}</p>}
        </div>

        <div className='flex items-center justify-center'>
          <span className='text-gray-400 text-sm'>or</span>
        </div>

        <button
          className='w-full border border-gray-300 hover:bg-gray-100 text-gray-700 font-medium py-2 rounded-xl flex items-center justify-center space-x-2 transition duration-300'
          onClick={() => signIn('google')}
        >
          <Image src='https://www.svgrepo.com/show/475656/google-color.svg' width={20} height={20} alt='Google logo' />
          <span>Sign in with Google</span>
        </button>
      </div>
    </div>
  )
}

export default LoginPage
