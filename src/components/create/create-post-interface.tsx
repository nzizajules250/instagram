'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ChevronDown, Image as ImageIcon, Smile, MapPin, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

interface User {
  id?: string
  name?: string | null
  email?: string | null
  image?: string | null
}

interface CreatePostInterfaceProps {
  currentUser: User
}

export function CreatePostInterface({ currentUser }: CreatePostInterfaceProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState<'select' | 'crop' | 'filter' | 'share'>('select')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [caption, setCaption] = useState('')
  const [location, setLocation] = useState('')
  const [accessibility, setAccessibility] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleImageSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
        setStep('crop')
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const handleCreatePost = async () => {
    if (!selectedImage || !caption.trim()) return

    setIsLoading(true)
    try {
      // Here you would upload the image and create the post
      // For now, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Redirect back to home feed
      router.push('/')
    } catch (error) {
      console.error('Error creating post:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    if (step === 'select') {
      router.back()
    } else if (step === 'crop') {
      setStep('select')
      setSelectedImage(null)
    } else if (step === 'filter') {
      setStep('crop')
    } else if (step === 'share') {
      setStep('filter')
    }
  }

  const renderStepHeader = () => {
    const titles = {
      select: 'Create new post',
      crop: 'Crop',
      filter: 'Filter',
      share: 'Share'
    }

    return (
      <div className="flex items-center justify-between p-4 border-b border-gray-300">
        <Button variant="ghost" onClick={handleBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="font-semibold">{titles[step]}</h1>
        {step !== 'select' && (
          <Button
            variant="ghost"
            onClick={() => {
              if (step === 'crop') setStep('filter')
              else if (step === 'filter') setStep('share')
              else if (step === 'share') handleCreatePost()
            }}
            className="text-blue-500 font-semibold"
          >
            {step === 'share' ? 'Share' : 'Next'}
          </Button>
        )}
      </div>
    )
  }

  if (step === 'select') {
    return (
      <Card className="max-w-2xl mx-auto bg-white">
        {renderStepHeader()}
        <CardContent className="p-0">
          <div className="flex flex-col items-center justify-center h-96 text-center">
            <div className="w-24 h-24 mb-6">
              <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-light mb-4">Drag photos and videos here</h2>
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Select from computer
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (step === 'crop' || step === 'filter') {
    return (
      <Card className="max-w-4xl mx-auto bg-white">
        {renderStepHeader()}
        <CardContent className="p-0">
          <div className="flex">
            {/* Image preview */}
            <div className="flex-1 aspect-square bg-black flex items-center justify-center">
              {selectedImage && (
                <img
                  src={selectedImage}
                  alt="Selected"
                  className="max-w-full max-h-full object-contain"
                />
              )}
            </div>

            {/* Controls sidebar */}
            {step === 'filter' && (
              <div className="w-80 border-l border-gray-300 p-4">
                <h3 className="font-semibold mb-4">Filters</h3>
                <div className="grid grid-cols-3 gap-2">
                  {['Normal', 'Clarendon', 'Gingham', 'Moon', 'Lark', 'Reyes', 'Juno', 'Slumber', 'Crema'].map((filter) => (
                    <div key={filter} className="text-center">
                      <div className="w-16 h-16 bg-gray-200 rounded mb-1 mx-auto relative overflow-hidden">
                        <img
                          src={selectedImage!}
                          alt={filter}
                          className="w-full h-full object-cover"
                          style={{
                            filter: filter === 'Normal' ? 'none' :
                                   filter === 'Clarendon' ? 'contrast(1.2) saturate(1.35)' :
                                   filter === 'Gingham' ? 'brightness(1.05) hue-rotate(-10deg)' :
                                   filter === 'Moon' ? 'grayscale(1) contrast(1.1) brightness(1.1)' :
                                   filter === 'Lark' ? 'contrast(0.9)' :
                                   filter === 'Reyes' ? 'sepia(0.22) brightness(1.1) contrast(0.85)' :
                                   filter === 'Juno' ? 'contrast(1.2) brightness(1.1) saturate(1.4)' :
                                   filter === 'Slumber' ? 'saturate(0.66) brightness(1.05)' :
                                   'contrast(1.1) brightness(1.1) saturate(0.9)'
                          }}
                        />
                      </div>
                      <p className="text-xs">{filter}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Share step
  return (
    <Card className="max-w-4xl mx-auto bg-white">
      {renderStepHeader()}
      <CardContent className="p-0">
        <div className="flex">
          {/* Image preview */}
          <div className="w-80 aspect-square bg-black flex items-center justify-center border-r border-gray-300">
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Selected"
                className="max-w-full max-h-full object-contain"
              />
            )}
          </div>

          {/* Share form */}
          <div className="flex-1 p-4">
            {/* User info */}
            <div className="flex items-center space-x-3 mb-4">
              <Avatar className="w-8 h-8">
                <AvatarImage src={currentUser?.image || ''} />
                <AvatarFallback>
                  {currentUser?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <span className="font-semibold text-sm">
                {(currentUser as any)?.username || currentUser?.name}
              </span>
            </div>

            {/* Caption */}
            <div className="mb-4">
              <Textarea
                placeholder="Write a caption..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="border-none resize-none text-base p-0 focus:ring-0"
                rows={8}
                maxLength={2200}
              />
              <div className="flex items-center justify-between mt-2">
                <Button variant="ghost" size="sm">
                  <Smile className="w-4 h-4" />
                </Button>
                <span className="text-xs text-gray-400">
                  {caption.length}/2,200
                </span>
              </div>
            </div>

            {/* Add location */}
            <div className="border-t border-gray-200 py-4">
              <div className="flex items-center justify-between">
                <Input
                  placeholder="Add location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="border-none p-0 focus:ring-0"
                />
                <MapPin className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Accessibility */}
            <div className="border-t border-gray-200 py-4">
              <Label className="text-sm font-semibold mb-2 block">Accessibility</Label>
              <p className="text-xs text-gray-500 mb-2">
                Alt text describes your photos for people with visual impairments.
              </p>
              <Input
                placeholder="Write alt text..."
                value={accessibility}
                onChange={(e) => setAccessibility(e.target.value)}
                className="text-sm"
              />
            </div>

            {/* Advanced settings */}
            <div className="border-t border-gray-200 py-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Hide like and view counts on this post</span>
                <input type="checkbox" className="toggle" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Turn off commenting</span>
                <input type="checkbox" className="toggle" />
              </div>
            </div>

            {isLoading && (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                <span className="ml-2 text-sm">Sharing...</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
