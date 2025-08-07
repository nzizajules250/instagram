'use client'

import { useState, useEffect, useRef } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Phone, Video, Info, Smile, Image as ImageIcon, Heart, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { getSocket, type ChatMessage } from '@/lib/socket'

interface User {
  id?: string
  name?: string | null
  email?: string | null
  image?: string | null
}

interface Conversation {
  id: string
  otherUser: {
    id: string
    username: string
    fullName: string
    profilePicture: string
    isOnline: boolean
  }
}

interface ChatWindowProps {
  conversation: Conversation
  currentUser: User
  isConnected: boolean
}

// Mock messages for the selected conversation
const mockMessages: ChatMessage[] = [
  {
    id: '1',
    senderId: 'john_doe',
    receiverId: 'current-user',
    content: 'Hey! How are you doing?',
    messageType: 'text',
    createdAt: new Date(Date.now() - 60 * 60 * 1000),
    isRead: true,
  },
  {
    id: '2',
    senderId: 'current-user',
    receiverId: 'john_doe',
    content: 'I\'m great! Just finished working on a new project. How about you?',
    messageType: 'text',
    createdAt: new Date(Date.now() - 50 * 60 * 1000),
    isRead: true,
  },
  {
    id: '3',
    senderId: 'john_doe',
    receiverId: 'current-user',
    content: 'That sounds awesome! I\'d love to hear more about it.',
    messageType: 'text',
    createdAt: new Date(Date.now() - 40 * 60 * 1000),
    isRead: true,
  },
  {
    id: '4',
    senderId: 'current-user',
    receiverId: 'john_doe',
    content: 'Sure! I\'ll send you some details later today.',
    messageType: 'text',
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
    isRead: true,
  },
  {
    id: '5',
    senderId: 'john_doe',
    receiverId: 'current-user',
    content: 'Perfect! Looking forward to it 🚀',
    messageType: 'text',
    createdAt: new Date(Date.now() - 10 * 60 * 1000),
    isRead: false,
  },
]

export function ChatWindow({ conversation, currentUser, isConnected }: ChatWindowProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages)
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Real-time messaging setup
  useEffect(() => {
    const socket = getSocket()
    if (!socket) return

    // Join conversation room
    socket.emit('join_conversation', conversation.id)

    // Listen for new messages
    socket.on('new_message', (message: ChatMessage) => {
      if (message.senderId !== (currentUser as any)?.id) {
        setMessages(prev => [...prev, message])
      }
    })

    // Listen for typing indicators
    socket.on('user_typing', (data: { userId: string, isTyping: boolean }) => {
      if (data.userId !== (currentUser as any)?.id) {
        setIsOtherUserTyping(data.isTyping)
      }
    })

    // Listen for message read receipts
    socket.on('message_read', (messageId: string) => {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === messageId ? { ...msg, isRead: true } : msg
        )
      )
    })

    return () => {
      socket.emit('leave_conversation', conversation.id)
      socket.off('new_message')
      socket.off('user_typing')
      socket.off('message_read')
    }
  }, [conversation.id, currentUser])

  // Handle typing indicator
  useEffect(() => {
    const socket = getSocket()
    if (!socket) return

    if (isTyping) {
      socket.emit('typing', { conversationId: conversation.id, isTyping: true })

      const timer = setTimeout(() => {
        setIsTyping(false)
        socket.emit('typing', { conversationId: conversation.id, isTyping: false })
      }, 2000)

      return () => clearTimeout(timer)
    } else {
      socket.emit('typing', { conversationId: conversation.id, isTyping: false })
    }
  }, [isTyping, conversation.id])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const socket = getSocket()
    if (!socket) return

    const message: ChatMessage = {
      id: Date.now().toString(),
      senderId: (currentUser as any)?.id || 'current-user',
      receiverId: conversation.otherUser.id,
      content: newMessage,
      messageType: 'text',
      createdAt: new Date(),
      isRead: false,
    }

    // Add message locally immediately
    setMessages(prev => [...prev, message])

    // Send via socket
    socket.emit('send_message', {
      conversationId: conversation.id,
      message,
    })

    setNewMessage('')
    setIsTyping(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value)
    if (!isTyping && e.target.value.length > 0) {
      setIsTyping(true)
    }
  }

  const formatMessageTime = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true })
  }

  const groupMessagesByDate = (messages: ChatMessage[]) => {
    const groups: { [key: string]: ChatMessage[] } = {}

    messages.forEach(message => {
      const dateKey = message.createdAt.toDateString()
      if (!groups[dateKey]) {
        groups[dateKey] = []
      }
      groups[dateKey].push(message)
    })

    return groups
  }

  const messageGroups = groupMessagesByDate(messages)

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="border-b border-gray-300 p-4 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar className="w-10 h-10">
                <AvatarImage src={conversation.otherUser.profilePicture} />
                <AvatarFallback>
                  {conversation.otherUser.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {conversation.otherUser.isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              )}
            </div>
            <div>
              <h3 className="font-semibold">{conversation.otherUser.username}</h3>
              <p className="text-sm text-gray-500">
                {conversation.otherUser.isOnline ? 'Active now' : 'Last seen recently'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Phone className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm">
              <Video className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm">
              <Info className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {Object.entries(messageGroups).map(([date, dayMessages]) => (
            <div key={date}>
              {/* Date divider */}
              <div className="text-center text-xs text-gray-500 my-4">
                {new Date(date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>

              {/* Messages for this date */}
              {dayMessages.map((message, index) => {
                const isCurrentUser = message.senderId === (currentUser as any)?.id || message.senderId === 'current-user'
                const showTime = index === dayMessages.length - 1 ||
                  dayMessages[index + 1]?.senderId !== message.senderId

                return (
                  <div
                    key={message.id}
                    className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-2`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                      isCurrentUser
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      {showTime && (
                        <p className={`text-xs mt-1 ${
                          isCurrentUser ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {formatMessageTime(message.createdAt)}
                          {isCurrentUser && (
                            <span className="ml-1">
                              {message.isRead ? '✓✓' : '✓'}
                            </span>
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ))}

          {/* Typing indicator */}
          {isOtherUserTyping && (
            <div className="flex justify-start mb-2">
              <div className="bg-gray-100 px-4 py-2 rounded-2xl">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Message input */}
      <div className="border-t border-gray-300 p-4 bg-white">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <Button type="button" variant="ghost" size="sm">
            <Smile className="w-5 h-5" />
          </Button>

          <div className="flex-1 relative">
            <Input
              placeholder="Message..."
              value={newMessage}
              onChange={handleInputChange}
              className="border-2 border-gray-300 rounded-full pl-4 pr-12 focus:border-blue-500"
            />
            <Button type="button" variant="ghost" size="sm" className="absolute right-1 top-1/2 transform -translate-y-1/2">
              <ImageIcon className="w-4 h-4" />
            </Button>
          </div>

          {newMessage.trim() ? (
            <Button type="submit" variant="ghost" size="sm" className="text-blue-500 font-semibold">
              Send
            </Button>
          ) : (
            <Button type="button" variant="ghost" size="sm">
              <Heart className="w-5 h-5" />
            </Button>
          )}
        </form>

        {/* Connection status */}
        <div className="flex items-center justify-center mt-2">
          <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-xs text-gray-500">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>
    </div>
  )
}
