'use client'

import { useSession } from 'next-auth/react'
import { Stories } from './stories'
import { PostCard } from './post-card'
import { SuggestedUsers } from './suggested-users'
import { useEffect, useState } from 'react'
import { mockDatabase } from '@/lib/mock-db'

// Mock data for development
const mockPosts = [
  {
    id: '1',
    user: {
      id: '1',
      username: 'john_doe',
      fullName: 'John Doe',
      profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=faces',
      isVerified: true,
    },
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop',
    caption: 'Beautiful sunset at the beach 🌅 #sunset #beach #photography',
    likeCount: 1249,
    commentCount: 32,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    isLiked: false,
    isSaved: false,
  },
  {
    id: '2',
    user: {
      id: '2',
      username: 'jane_smith',
      fullName: 'Jane Smith',
      profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=faces',
      isVerified: false,
    },
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=600&fit=crop',
    caption: 'Delicious homemade pasta! Recipe in my stories 🍝',
    likeCount: 856,
    commentCount: 28,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    isLiked: true,
    isSaved: true,
  },
  {
    id: '3',
    user: {
      id: '3',
      username: 'travel_addict',
      fullName: 'Travel Addict',
      profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces',
      isVerified: true,
    },
    imageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=600&fit=crop',
    caption: 'Exploring the mountains of Switzerland 🏔️ #travel #mountains #adventure',
    likeCount: 2150,
    commentCount: 89,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    isLiked: false,
    isSaved: false,
  },
]

export function MainFeed() {
  const { data: session } = useSession()
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const postsWithUsers = await mockDatabase.getAllPosts()
        setPosts(postsWithUsers.map(post => ({
          ...post,
          isLiked: false,
          isSaved: false,
        })))
      } catch (error) {
        console.error('Error loading posts:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPosts()
  }, [])

  const handleLike = (postId: string) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? {
            ...post,
            isLiked: !post.isLiked,
            likeCount: post.isLiked ? post.likeCount - 1 : post.likeCount + 1
          }
        : post
    ))
  }

  const handleSave = (postId: string) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, isSaved: !post.isSaved }
        : post
    ))
  }

  if (!session) {
    return null
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex gap-8">
        {/* Main feed */}
        <div className="flex-1 max-w-lg mx-auto">
          {/* Stories */}
          <div className="mb-8">
            <Stories />
          </div>

          {/* Posts */}
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={handleLike}
                onSave={handleSave}
              />
            ))}
          </div>

          {/* Load more */}
          <div className="text-center mt-8">
            <p className="text-gray-500">You're all caught up!</p>
            <p className="text-sm text-gray-400 mt-2">
              You've seen all new posts from the past 3 days.
            </p>
          </div>
        </div>

        {/* Sidebar - only on desktop */}
        <div className="hidden lg:block w-80">
          <div className="sticky top-8">
            {/* Current user info */}
            <div className="bg-white rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 p-0.5">
                  <img
                    src={session.user?.image || `https://ui-avatars.com/api/?name=${session.user?.name}&background=random`}
                    alt={session.user?.name || 'User'}
                    className="w-full h-full rounded-full border-2 border-white object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{(session.user as any)?.username || session.user?.name}</p>
                  <p className="text-gray-500 text-sm">{session.user?.name}</p>
                </div>
                <button className="text-blue-500 text-sm font-semibold">Switch</button>
              </div>
            </div>

            {/* Suggested users */}
            <SuggestedUsers />

            {/* Footer links */}
            <div className="mt-8 text-xs text-gray-400 space-y-1">
              <div className="flex flex-wrap gap-1">
                <span>About •</span>
                <span>Help •</span>
                <span>Press •</span>
                <span>API •</span>
                <span>Jobs •</span>
                <span>Privacy •</span>
                <span>Terms</span>
              </div>
              <div className="flex flex-wrap gap-1">
                <span>Locations •</span>
                <span>Language •</span>
                <span>Meta Verified</span>
              </div>
              <div className="mt-4">
                <p>© 2025 INSTAGRAM FROM META</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
