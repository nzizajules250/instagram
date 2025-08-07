'use client'

import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface PostUser {
  id: string
  username: string
  fullName: string
  profilePicture: string
  isVerified: boolean
}

interface Post {
  id: string
  user: PostUser
  imageUrl: string
  caption: string
  likeCount: number
  commentCount: number
  createdAt: Date
  isLiked: boolean
  isSaved: boolean
}

interface PostCardProps {
  post: Post
  onLike: (postId: string) => void
  onSave: (postId: string) => void
}

export function PostCard({ post, onLike, onSave }: PostCardProps) {
  const [showAllCaption, setShowAllCaption] = useState(false)
  const [newComment, setNewComment] = useState('')

  const formatTimeAgo = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true })
  }

  const truncateCaption = (text: string, maxLength: number = 125) => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + '...'
  }

  const handleDoubleClick = () => {
    if (!post.isLiked) {
      onLike(post.id)
    }
  }

  return (
    <div className="bg-white border border-gray-300 rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 p-0.5">
            <Avatar className="w-full h-full border-2 border-white">
              <AvatarImage src={post.user.profilePicture} />
              <AvatarFallback>{post.user.username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex items-center space-x-1">
            <span className="font-semibold text-sm">{post.user.username}</span>
            {post.user.isVerified && (
              <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
            <span className="text-gray-500 text-sm">•</span>
            <span className="text-gray-500 text-sm">{formatTimeAgo(post.createdAt)}</span>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Report</DropdownMenuItem>
            <DropdownMenuItem>Unfollow</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Go to post</DropdownMenuItem>
            <DropdownMenuItem>Share to...</DropdownMenuItem>
            <DropdownMenuItem>Copy link</DropdownMenuItem>
            <DropdownMenuItem>Embed</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Image */}
      <div className="relative">
        <img
          src={post.imageUrl}
          alt="Post image"
          className="w-full aspect-square object-cover cursor-pointer"
          onDoubleClick={handleDoubleClick}
        />
        {/* Double-tap heart animation could be added here */}
      </div>

      {/* Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onLike(post.id)}
              className="p-0 hover:bg-transparent"
            >
              <Heart
                className={`w-6 h-6 ${
                  post.isLiked ? 'fill-red-500 text-red-500' : 'text-gray-700'
                }`}
              />
            </Button>
            <Button variant="ghost" size="sm" className="p-0 hover:bg-transparent">
              <MessageCircle className="w-6 h-6 text-gray-700" />
            </Button>
            <Button variant="ghost" size="sm" className="p-0 hover:bg-transparent">
              <Send className="w-6 h-6 text-gray-700" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSave(post.id)}
            className="p-0 hover:bg-transparent"
          >
            <Bookmark
              className={`w-6 h-6 ${
                post.isSaved ? 'fill-gray-700 text-gray-700' : 'text-gray-700'
              }`}
            />
          </Button>
        </div>

        {/* Likes */}
        <div className="mb-2">
          <span className="font-semibold text-sm">
            {post.likeCount.toLocaleString()} likes
          </span>
        </div>

        {/* Caption */}
        {post.caption && (
          <div className="mb-2">
            <span className="font-semibold text-sm mr-2">{post.user.username}</span>
            <span className="text-sm">
              {showAllCaption ? post.caption : truncateCaption(post.caption)}
              {post.caption.length > 125 && (
                <button
                  onClick={() => setShowAllCaption(!showAllCaption)}
                  className="text-gray-500 ml-1"
                >
                  {showAllCaption ? 'less' : 'more'}
                </button>
              )}
            </span>
          </div>
        )}

        {/* Comments */}
        {post.commentCount > 0 && (
          <button className="text-gray-500 text-sm mb-2 block">
            View all {post.commentCount} comments
          </button>
        )}

        {/* Add comment */}
        <div className="border-t border-gray-200 pt-3 mt-3">
          <div className="flex items-center space-x-3">
            <input
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 text-sm border-none outline-none bg-transparent"
            />
            {newComment && (
              <button className="text-blue-500 font-semibold text-sm">
                Post
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
