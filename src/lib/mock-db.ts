// In-memory database for testing without PostgreSQL

export interface MockUser {
  id: string
  username: string
  email: string
  password: string
  fullName: string
  bio?: string
  profilePicture?: string
  isVerified: boolean
  followerCount: number
  followingCount: number
  postCount: number
  createdAt: Date
}

export interface MockPost {
  id: string
  userId: string
  caption: string
  imageUrl: string
  likeCount: number
  commentCount: number
  createdAt: Date
  isLiked?: boolean
  isSaved?: boolean
}

export interface MockMessage {
  id: string
  senderId: string
  receiverId: string
  content: string
  messageType: 'text' | 'image'
  createdAt: Date
  isRead: boolean
}

// Mock data storage
const mockUsers: MockUser[] = [
  {
    id: 'demo-user-1',
    username: 'demo_user',
    email: 'demo@instagram.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj.RK8Qvvp2.', // password: "password"
    fullName: 'Demo User',
    bio: 'Welcome to my Instagram clone! 📸',
    profilePicture: 'https://ui-avatars.com/api/?name=Demo+User&background=random',
    isVerified: true,
    followerCount: 1250,
    followingCount: 890,
    postCount: 42,
    createdAt: new Date(),
  },
  {
    id: 'user-2',
    username: 'john_doe',
    email: 'john@example.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj.RK8Qvvp2.',
    fullName: 'John Doe',
    bio: 'Photographer and traveler',
    profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=faces',
    isVerified: true,
    followerCount: 2840,
    followingCount: 320,
    postCount: 156,
    createdAt: new Date(),
  },
  {
    id: 'user-3',
    username: 'jane_smith',
    email: 'jane@example.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj.RK8Qvvp2.',
    fullName: 'Jane Smith',
    bio: 'Food blogger & chef 🍽️',
    profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=faces',
    isVerified: false,
    followerCount: 5640,
    followingCount: 1240,
    postCount: 203,
    createdAt: new Date(),
  }
]

const mockPosts: MockPost[] = [
  {
    id: 'post-1',
    userId: 'user-2',
    caption: 'Beautiful sunset at the beach 🌅 #sunset #beach #photography',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop',
    likeCount: 1249,
    commentCount: 32,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: 'post-2',
    userId: 'user-3',
    caption: 'Delicious homemade pasta! Recipe in my stories 🍝',
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=600&fit=crop',
    likeCount: 856,
    commentCount: 28,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
  }
]

const mockMessages: MockMessage[] = [
  {
    id: 'msg-1',
    senderId: 'user-2',
    receiverId: 'demo-user-1',
    content: 'Hey! How are you doing?',
    messageType: 'text',
    createdAt: new Date(Date.now() - 10 * 60 * 1000),
    isRead: false,
  },
  {
    id: 'msg-2',
    senderId: 'demo-user-1',
    receiverId: 'user-2',
    content: 'I\'m great! Just finished working on this Instagram clone.',
    messageType: 'text',
    createdAt: new Date(Date.now() - 5 * 60 * 1000),
    isRead: true,
  }
]

// Mock database functions
export const mockDatabase = {
  // Users
  findUserByUsername: async (username: string): Promise<MockUser | null> => {
    return mockUsers.find(user => user.username === username || user.email === username) || null
  },

  findUserById: async (id: string): Promise<MockUser | null> => {
    return mockUsers.find(user => user.id === id) || null
  },

  createUser: async (userData: Omit<MockUser, 'id' | 'createdAt'>): Promise<MockUser> => {
    const newUser: MockUser = {
      ...userData,
      id: `user-${Date.now()}`,
      createdAt: new Date(),
    }
    mockUsers.push(newUser)
    return newUser
  },

  // Posts
  getAllPosts: async (): Promise<(MockPost & { user: MockUser })[]> => {
    return mockPosts.map(post => {
      const user = mockUsers.find(u => u.id === post.userId)!
      return { ...post, user }
    })
  },

  createPost: async (postData: Omit<MockPost, 'id' | 'createdAt'>): Promise<MockPost> => {
    const newPost: MockPost = {
      ...postData,
      id: `post-${Date.now()}`,
      createdAt: new Date(),
    }
    mockPosts.push(newPost)
    return newPost
  },

  // Messages
  getConversations: async (userId: string) => {
    // Group messages by conversation
    const conversations = new Map()

    mockMessages.forEach(message => {
      const otherUserId = message.senderId === userId ? message.receiverId : message.senderId
      const key = [userId, otherUserId].sort().join('-')

      if (!conversations.has(key)) {
        conversations.set(key, {
          id: key,
          participant1Id: userId,
          participant2Id: otherUserId,
          messages: [],
          lastMessage: null,
          lastMessageAt: null,
          unreadCount: 0
        })
      }

      const conv = conversations.get(key)
      conv.messages.push(message)
      conv.lastMessage = message
      conv.lastMessageAt = message.createdAt

      if (message.receiverId === userId && !message.isRead) {
        conv.unreadCount++
      }
    })

    return Array.from(conversations.values())
  },

  getMessages: async (conversationId: string): Promise<MockMessage[]> => {
    return mockMessages.filter(message => {
      const [user1, user2] = conversationId.split('-')
      return (message.senderId === user1 && message.receiverId === user2) ||
             (message.senderId === user2 && message.receiverId === user1)
    })
  },

  createMessage: async (messageData: Omit<MockMessage, 'id' | 'createdAt'>): Promise<MockMessage> => {
    const newMessage: MockMessage = {
      ...messageData,
      id: `msg-${Date.now()}`,
      createdAt: new Date(),
    }
    mockMessages.push(newMessage)
    return newMessage
  }
}
