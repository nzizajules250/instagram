'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { DemoInfo } from '@/components/demo-info'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid username or password')
      } else {
        router.push('/')
      }
    } catch (error) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="flex w-full max-w-4xl">
        {/* Left side with phone mockups */}
        <div className="hidden lg:flex flex-1 items-center justify-center relative">
          <div className="relative w-[380px] h-[600px]">
            {/* Instagram phone mockup with posts */}
            <Image
              src="https://ext.same-assets.com/1163440064/1435255325.html"
              alt="Instagram app interface"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Right side with login form */}
        <div className="flex-1 flex flex-col items-center justify-center max-w-sm mx-auto">
          {/* Main login card */}
          <Card className="w-full bg-white border border-gray-300">
            <CardContent className="p-10">
              {/* Instagram logo */}
              <div className="text-center mb-8">
                <h1 className="text-4xl font-normal text-black" style={{ fontFamily: 'Billabong, cursive' }}>
                  Instagram
                </h1>
              </div>

              {/* Login form */}
              <form onSubmit={handleSubmit} className="space-y-2">
                <Input
                  type="text"
                  placeholder="Phone number, username, or email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="instagram-input"
                  required
                />

                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="instagram-input"
                  required
                />

                {error && (
                  <p className="text-red-500 text-sm text-center">{error}</p>
                )}

                <Button
                  type="submit"
                  disabled={isLoading || !username || !password}
                  className="w-full instagram-button mt-4"
                >
                  {isLoading ? 'Logging in...' : 'Log in'}
                </Button>
              </form>

              {/* Divider */}
              <div className="flex items-center my-6">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="px-4 text-sm text-gray-500 font-semibold">OR</span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>

              {/* Facebook login */}
              <Button
                variant="ghost"
                className="w-full text-blue-500 font-semibold hover:bg-transparent"
                onClick={() => signIn('facebook')}
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Log in with Facebook
              </Button>

              {/* Forgot password */}
              <div className="text-center mt-4">
                <Link href="/forgot-password" className="text-xs text-blue-900 hover:underline">
                  Forgot password?
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Sign up card */}
          <Card className="w-full bg-white border border-gray-300 mt-3">
            <CardContent className="p-6 text-center">
              <p className="text-sm">
                Don't have an account?{' '}
                <Link href="/signup" className="text-blue-500 font-semibold hover:underline">
                  Sign up
                </Link>
              </p>
            </CardContent>
          </Card>

          {/* Demo info */}
          <DemoInfo />

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

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 py-4">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap justify-center text-xs text-gray-500 space-x-4 mb-2">
            <Link href="#" className="hover:underline">Meta</Link>
            <Link href="#" className="hover:underline">About</Link>
            <Link href="#" className="hover:underline">Blog</Link>
            <Link href="#" className="hover:underline">Jobs</Link>
            <Link href="#" className="hover:underline">Help</Link>
            <Link href="#" className="hover:underline">API</Link>
            <Link href="#" className="hover:underline">Privacy</Link>
            <Link href="#" className="hover:underline">Terms</Link>
            <Link href="#" className="hover:underline">Locations</Link>
            <Link href="#" className="hover:underline">Instagram Lite</Link>
            <Link href="#" className="hover:underline">Threads</Link>
            <Link href="#" className="hover:underline">Contact Uploading & Non-Users</Link>
            <Link href="#" className="hover:underline">Meta Verified</Link>
          </div>
          <div className="text-center text-xs text-gray-500">
            <span>English</span>
            <span className="ml-4">© 2025 Instagram from Meta</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
