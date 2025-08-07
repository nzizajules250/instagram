import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export const initSocket = (userId: string): Socket => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
      query: { userId },
      transports: ['websocket', 'polling'],
    })

    socket.on('connect', () => {
      console.log('Connected to socket server')
    })

    socket.on('disconnect', () => {
      console.log('Disconnected from socket server')
    })

    socket.on('error', (error) => {
      console.error('Socket error:', error)
    })
  }

  return socket
}

export const getSocket = (): Socket | null => {
  return socket
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

// Message types
export interface ChatMessage {
  id: string
  senderId: string
  receiverId: string
  content: string
  messageType: 'text' | 'image'
  createdAt: Date
  isRead: boolean
}

export interface Conversation {
  id: string
  participant1Id: string
  participant2Id: string
  lastMessage?: ChatMessage
  lastMessageAt?: Date
  unreadCount: number
}
