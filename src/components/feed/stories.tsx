'use client'

import { useSession } from 'next-auth/react'
import { Plus } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'

// Mock data for stories
const mockStories = [
  {
    id: '1',
    user: {
      username: 'your_story',
      profilePicture: '',
      hasNewStory: false,
    },
  },
  {
    id: '2',
    user: {
      username: 'john_doe',
      profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=faces',
      hasNewStory: true,
    },
  },
  {
    id: '3',
    user: {
      username: 'jane_smith',
      profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=faces',
      hasNewStory: true,
    },
  },
  {
    id: '4',
    user: {
      username: 'travel_addict',
      profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces',
      hasNewStory: true,
    },
  },
  {
    id: '5',
    user: {
      username: 'foodie_life',
      profilePicture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=faces',
      hasNewStory: false,
    },
  },
  {
    id: '6',
    user: {
      username: 'nature_lover',
      profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces',
      hasNewStory: true,
    },
  },
  {
    id: '7',
    user: {
      username: 'art_gallery',
      profilePicture: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=150&h=150&fit=crop&crop=faces',
      hasNewStory: false,
    },
  },
]

export function Stories() {
  const { data: session } = useSession()

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4">
      <ScrollArea className="w-full">
        <div className="flex space-x-4 pb-2">
          {mockStories.map((story, index) => (
            <div key={story.id} className="flex-shrink-0 text-center cursor-pointer">
              <div className="relative">
                {/* Story ring */}
                <div className={`w-16 h-16 rounded-full p-0.5 ${
                  story.user.hasNewStory
                    ? 'bg-gradient-to-r from-purple-400 via-pink-500 to-red-500'
                    : 'bg-gray-300'
                }`}>
                  <div className="w-full h-full rounded-full bg-white p-0.5">
                    {index === 0 ? (
                      // Your story (add story button)
                      <div className="relative w-full h-full rounded-full bg-gray-100 flex items-center justify-center">
                        <img
                          src={session?.user?.image || `https://ui-avatars.com/api/?name=${session?.user?.name}&background=random`}
                          alt="Your story"
                          className="w-full h-full rounded-full object-cover"
                        />
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                          <Plus className="w-3 h-3 text-white" />
                        </div>
                      </div>
                    ) : (
                      <img
                        src={story.user.profilePicture}
                        alt={story.user.username}
                        className="w-full h-full rounded-full object-cover"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Username */}
              <p className="text-xs text-gray-800 mt-1 max-w-[64px] truncate">
                {index === 0 ? 'Your story' : story.user.username}
              </p>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
