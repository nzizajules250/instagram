'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'

export default function SignupPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        router.push('/login?message=Account created successfully')
      } else {
        setError(data.error || 'Something went wrong')
      }
    } catch (error) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid = formData.username && formData.email && formData.password && formData.fullName

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm mx-auto">
        {/* Main signup card */}
        <Card className="w-full bg-white border border-gray-300">
          <CardContent className="p-10">
            {/* Instagram logo */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-normal text-black" style={{ fontFamily: 'Billabong, cursive' }}>
                Instagram
              </h1>
              <p className="text-gray-500 text-sm font-semibold mt-2">
                Sign up to see photos and videos from your friends.
              </p>
            </div>

            {/* Facebook signup */}
            <Button className="w-full instagram-button mb-4">
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Log in with Facebook
            </Button>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-sm text-gray-500 font-semibold">OR</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Signup form */}
            <form onSubmit={handleSubmit} className="space-y-2">
              <Input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="instagram-input"
                required
              />

              <Input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                className="instagram-input"
                required
              />

              <Input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className="instagram-input"
                required
              />

              <Input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="instagram-input"
                required
              />

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              <div className="text-xs text-gray-500 text-center my-4 px-4">
                People who use our service may have uploaded your contact information to Instagram.{' '}
                <Link href="#" className="text-gray-900 hover:underline">Learn More</Link>
              </div>

              <div className="text-xs text-gray-500 text-center mb-6 px-4">
                By signing up, you agree to our{' '}
                <Link href="#" className="text-gray-900 hover:underline">Terms</Link>,{' '}
                <Link href="#" className="text-gray-900 hover:underline">Privacy Policy</Link> and{' '}
                <Link href="#" className="text-gray-900 hover:underline">Cookies Policy</Link>.
              </div>

              <Button
                type="submit"
                disabled={isLoading || !isFormValid}
                className="w-full instagram-button"
              >
                {isLoading ? 'Signing up...' : 'Sign up'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Login card */}
        <Card className="w-full bg-white border border-gray-300 mt-3">
          <CardContent className="p-6 text-center">
            <p className="text-sm">
              Have an account?{' '}
              <Link href="/login" className="text-blue-500 font-semibold hover:underline">
                Log in
              </Link>
            </p>
          </CardContent>
        </Card>

        {/* Get the app */}
        <div className="text-center mt-5">
          <p className="text-sm mb-3">Get the app.</p>
          <div className="flex justify-center space-x-2">
            <Image
              src="https://static.cdninstagram.com/rsrc.php/v3/yz/r/c5Rp7Ym-Klz.png"
              alt="Get it on Google Play"
              width={136}
              height={40}
              className="cursor-pointer"
            />
            <Image
              src="https://static.cdninstagram.com/rsrc.php/v3/yu/r/EHY6QnZYdNX.png"
              alt="Get it from Microsoft"
              width={136}
              height={40}
              className="cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
