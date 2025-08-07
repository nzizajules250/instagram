import { NextRequest, NextResponse } from 'next/server'
import { mockDatabase } from '@/lib/mock-db'
import { hashPassword } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { username, email, password, fullName } = await request.json()

    // Validate input
    if (!username || !email || !password || !fullName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await mockDatabase.findUserByUsername(username) ||
                         await mockDatabase.findUserByUsername(email)

    if (existingUser) {
      return NextResponse.json(
        { error: 'Username or email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const newUser = await mockDatabase.createUser({
      username,
      email,
      password: hashedPassword,
      fullName,
      bio: '',
      profilePicture: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random`,
      isVerified: false,
      followerCount: 0,
      followingCount: 0,
      postCount: 0,
    })

    return NextResponse.json(
      { message: 'User created successfully', user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        fullName: newUser.fullName,
      }},
      { status: 201 }
    )
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
