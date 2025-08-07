'use client'

import { useState, useEffect } from 'react'
import { Search, Edit, MoreHorizontal, Phone, Video, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChatWindow } from './chat-window'
import { getSocket, type Conversation, type ChatMessage } from '@/lib/socket'

interface User {
  id?: string
  name?: string | null
  email?: string | null
  image?: string | null
}

interface MessagingInterfaceProps {
  currentUser: User
  isConnected: boolean
}

// Mock conversations data
const mockConversations: (Conversation & {
  otherUser: {
    id: string
    username: string
    fullName: string
    profilePicture: string
    isOnline: boolean
  }
})[] = [
  {
    id: '1',
    participant1Id: 'current-user',
    participant2Id: 'john_doe',
    unreadCount: 2,
    lastMessageAt: new Date(Date.now() - 10 * 60 * 1000),
    lastMessage: {
      id: 'msg1',
      senderId: 'john_doe',
      receiverId: 'current-user',
      content: 'Hey! How are you doing?',
      messageType: 'text',
      createdAt: new Date(Date.now() - 10 * 60 * 1000),
      isRead: false,
    },
    otherUser: {
      id: 'john_doe',
      username: 'john_doe',
      fullName: 'John Doe',
      profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=faces',
      isOnline: true,
    },
  },
  {
    id: '2',
    participant1Id: 'current-user',
    participant2Id: 'jane_smith',
    unreadCount: 0,
    lastMessageAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    lastMessage: {
      id: 'msg2',
      senderId: 'current-user',
      receiverId: 'jane_smith',
      content: 'Thanks for sharing that recipe!',
      messageType: 'text',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isRead: true,
    },
    otherUser: {
      id: 'jane_smith',
      username: 'jane_smith',
      fullName: 'Jane Smith',
      profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=faces',
      isOnline: false,
    },
  },
  {
    id: '3',
    participant1Id: 'current-user',
    participant2Id: 'travel_addict',
    unreadCount: 1,
    lastMessageAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    lastMessage: {
      id: 'msg3',
      senderId: 'travel_addict',
      receiverId: 'current-user',
      content: 'Those mountain photos are incredible! 📸',
      messageType: 'text',
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      isRead: false,
    },
    otherUser: {
      id: 'travel_addict',
      username: 'travel_addict',
      fullName: 'Travel Addict',
      profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces',
      isOnline: true,
    },
  },
]

export function MessagingInterface({ currentUser, isConnected }: MessagingInterfaceProps) {
  const [conversations, setConversations] = useState(mockConversations)
  const [selectedConversation, setSelectedConversation] = useState<typeof mockConversations[0] | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])

  // Initialize real-time messaging
  useEffect(() => {
    const socket = getSocket()
    if (!socket) return

    // Listen for new messages
    socket.on('new_message', (message: ChatMessage) => {
      setMessages(prev => [...prev, message])

      // Update conversation list
      setConversations(prev =>
        prev.map(conv =>
          conv.id === selectedConversation?.id
            ? { ...conv, lastMessage: message, lastMessageAt: message.createdAt }
            : conv
        )
      )
    })

    // Listen for message read status
    socket.on('message_read', (messageId: string) => {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === messageId ? { ...msg, isRead: true } : msg
        )
      )
    })

    return () => {
      socket.off('new_message')
      socket.off('message_read')
    }
  }, [selectedConversation])

  const filteredConversations = conversations.filter(conv =>
    conv.otherUser.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.otherUser.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatLastMessageTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 1) return 'now'
    if (minutes < 60) return `${minutes}m`
    if (hours < 24) return `${hours}h`
    return `${days}d`
  }

  return (
    <div className="flex h-full">
      {/* Conversations sidebar */}
      <div className="w-96 border-r border-gray-300 bg-white">
        {/* Header */}
        <div className="border-b border-gray-300 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">{(currentUser as any)?.username || currentUser.name}</h2>
            <Button variant="ghost" size="sm">
              <Edit className="w-5 h-5" />
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-100 border-none"
            />
          </div>
        </div>

        {/* Conversations list */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation)}
                className={`flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-50 ${
                  selectedConversation?.id === conversation.id ? 'bg-gray-100' : ''
                }`}
              >
                <div className="relative">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={conversation.otherUser.profilePicture} />
                    <AvatarFallback>
                      {conversation.otherUser.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {conversation.otherUser.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>

                <div className="flex-1 ml-3 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm truncate">
                      {conversation.otherUser.username}
                    </p>
                    <span className="text-xs text-gray-500">
                      {conversation.lastMessageAt && formatLastMessageTime(conversation.lastMessageAt)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 truncate">
                      {conversation.lastMessage?.senderId === (currentUser as any)?.id && 'You: '}
                      {conversation.lastMessage?.content}
                    </p>
                    {conversation.unreadCount > 0 && (
                      <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat area */}
      <div className="flex-1">
        {selectedConversation ? (
          <ChatWindow
            conversation={selectedConversation}
            currentUser={currentUser}
            isConnected={isConnected}
          />
        ) : (
          // No conversation selected
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <div className="w-24 h-24 border-2 border-gray-300 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Your Messages</h3>
            <p className="text-center max-w-xs">
              Send private photos and messages to a friend or group.
            </p>
            <Button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white">
              Send Message
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
