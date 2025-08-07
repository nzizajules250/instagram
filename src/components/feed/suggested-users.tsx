'use client'

import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

// Mock suggested users data
const mockSuggestedUsers = [
  {
    id: '1',
    username: 'alex_photo',
    fullName: 'Alex Photography',
    profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces',
    mutualFriends: 3,
    isFollowing: false,
  },
  {
    id: '2',
    username: 'sarah_art',
    fullName: 'Sarah Wilson',
    profilePicture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=faces',
    mutualFriends: 7,
    isFollowing: false,
  },
  {
    id: '3',
    username: 'mike_travels',
    fullName: 'Mike Anderson',
    profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces',
    mutualFriends: 12,
    isFollowing: false,
  },
  {
    id: '4',
    username: 'emma_design',
    fullName: 'Emma Design',
    profilePicture: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=150&h=150&fit=crop&crop=faces',
    mutualFriends: 5,
    isFollowing: false,
  },
  {
    id: '5',
    username: 'david_cook',
    fullName: 'David Cook',
    profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=faces',
    mutualFriends: 2,
    isFollowing: false,
  },
]

export function SuggestedUsers() {
  const [users, setUsers] = useState(mockSuggestedUsers)

  const handleFollow = (userId: string) => {
    setUsers(users.map(user =>
      user.id === userId
        ? { ...user, isFollowing: !user.isFollowing }
        : user
    ))
  }

  return (
    <div className="bg-white rounded-lg p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-500 text-sm">Suggested for you</h3>
        <button className="text-xs font-semibold text-gray-900">See All</button>
      </div>

      {/* Users list */}
      <div className="space-y-3">
        {users.slice(0, 5).map((user) => (
          <div key={user.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={user.profilePicture} />
                <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{user.username}</p>
                <p className="text-xs text-gray-500 truncate">
                  {user.mutualFriends > 0
                    ? `Followed by ${user.mutualFriends} mutual friends`
                    : 'Suggested for you'
                  }
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleFollow(user.id)}
              className={`text-xs font-semibold px-3 py-1 ${
                user.isFollowing
                  ? 'text-gray-900'
                  : 'text-blue-500 hover:text-blue-600'
              }`}
            >
              {user.isFollowing ? 'Following' : 'Follow'}
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
