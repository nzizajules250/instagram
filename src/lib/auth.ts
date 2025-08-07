import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { mockDatabase } from '@/lib/mock-db'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'Username or Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }

        try {
          // Find user by username or email
          const user = await mockDatabase.findUserByUsername(credentials.username)

          if (!user) {
            return null
          }

          // Verify password
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

          if (!isPasswordValid) {
            return null
          }

          return {
            id: user.id,
            username: user.username,
            email: user.email,
            name: user.fullName,
            image: user.profilePicture,
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.username = (user as any).username
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        ;(session.user as any).id = token.sub!
        ;(session.user as any).username = token.username
      }
      return session
    },
  },
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}
