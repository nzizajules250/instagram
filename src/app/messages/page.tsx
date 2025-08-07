'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { InstagramLayout } from '@/components/layout/instagram-layout'
import { MessagingInterface } from '@/components/messaging/messaging-interface'
import { initSocket, disconnectSocket } from '@/lib/socket'

export default function MessagesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/login')
      return
    }

    // Initialize socket connection
    const socket = initSocket((session.user as any)?.id || 'anonymous')

    socket.on('connect', () => {
      setIsConnected(true)
    })

    socket.on('disconnect', () => {
      setIsConnected(false)
    })

    return () => {
      disconnectSocket()
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <InstagramLayout>
      <div className="h-screen bg-white">
        <MessagingInterface
          currentUser={session.user!}
          isConnected={isConnected}
        />
      </div>
    </InstagramLayout>
  )
}
