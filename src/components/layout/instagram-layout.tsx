'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Home,
  Search,
  Compass,
  Heart,
  MessageCircle,
  PlusSquare,
  Menu,
  Settings,
  Bookmark,
  RotateCcw,
  Moon,
  Zap,
} from 'lucide-react'

interface InstagramLayoutProps {
  children: React.ReactNode
}

export function InstagramLayout({ children }: InstagramLayoutProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('home')

  const navigationItems = [
    { id: 'home', icon: Home, label: 'Home', href: '/' },
    { id: 'search', icon: Search, label: 'Search', href: '/search' },
    { id: 'explore', icon: Compass, label: 'Explore', href: '/explore' },
    { id: 'reels', icon: Heart, label: 'Reels', href: '/reels' },
    { id: 'messages', icon: MessageCircle, label: 'Messages', href: '/messages' },
    { id: 'notifications', icon: Heart, label: 'Notifications', href: '/notifications' },
    { id: 'create', icon: PlusSquare, label: 'Create', href: '/create' },
  ]

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Navigation */}
      <div className="hidden lg:flex">
        {/* Sidebar */}
        <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-300 p-4">
          {/* Logo */}
          <div className="mb-8 px-3">
            <Link href="/">
              <h1 className="text-3xl font-normal text-black" style={{ fontFamily: 'Billabong, cursive' }}>
                Instagram
              </h1>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors ${
                  activeTab === item.id ? 'font-semibold' : ''
                }`}
              >
                <item.icon className="w-6 h-6" />
                <span className="text-base">{item.label}</span>
              </Link>
            ))}

            {/* Profile */}
            <Link
              href={`/${session?.user?.name || 'profile'}`}
              onClick={() => setActiveTab('profile')}
              className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors ${
                activeTab === 'profile' ? 'font-semibold' : ''
              }`}
            >
              <Avatar className="w-6 h-6">
                <AvatarImage src={session?.user?.image || ''} />
                <AvatarFallback>
                  {session?.user?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <span className="text-base">Profile</span>
            </Link>
          </nav>

          {/* More menu */}
          <div className="absolute bottom-4 left-4 right-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start px-3 py-3">
                  <Menu className="w-6 h-6 mr-3" />
                  <span className="text-base">More</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Your activity
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bookmark className="w-4 h-4 mr-2" />
                  Saved
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Moon className="w-4 h-4 mr-2" />
                  Switch appearance
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Zap className="w-4 h-4 mr-2" />
                  Report a problem
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  Switch accounts
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </aside>

        {/* Main content */}
        <main className="ml-64 flex-1">
          {children}
        </main>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        {/* Top bar */}
        <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-300 px-4 py-3 z-50">
          <div className="flex items-center justify-between">
            <Link href="/">
              <h1 className="text-2xl font-normal text-black" style={{ fontFamily: 'Billabong, cursive' }}>
                Instagram
              </h1>
            </Link>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Heart className="w-6 h-6" />
              </Button>
              <Button variant="ghost" size="sm">
                <MessageCircle className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="pt-16 pb-16">
          {children}
        </main>

        {/* Bottom navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 px-4 py-2 z-50">
          <div className="flex items-center justify-around">
            {navigationItems.slice(0, 5).map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setActiveTab(item.id)}
                className="p-2"
              >
                <item.icon className={`w-6 h-6 ${activeTab === item.id ? 'text-black' : 'text-gray-500'}`} />
              </Link>
            ))}
            <Link
              href={`/${session?.user?.name || 'profile'}`}
              onClick={() => setActiveTab('profile')}
              className="p-2"
            >
              <Avatar className="w-6 h-6">
                <AvatarImage src={session?.user?.image || ''} />
                <AvatarFallback>
                  {session?.user?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </nav>
      </div>
    </div>
  )
}
