import NextAuth, { Session, User, AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { PrismaAdapter } from '@auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'
import { JWT } from 'next-auth/jwt'

const prisma = new PrismaClient()

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'john@doe.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) return null
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (
          user &&
          (await bcrypt.compare(credentials.password, user.password || ''))
        ) {
          return {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
            role: user.role
          }
        } else {
          throw new Error('Invalid email or password')
        }
      },
    }),
    GoogleProvider({
      allowDangerousEmailAccountLinking: true,
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: `${profile.given_name} ${profile.family_name}`,
          email: profile.email,
          image: profile.picture
        }
      },
    })
  ],
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user }: { user: { email?: string } }) {
      // ตัวอย่าง: ตรวจสอบว่าผู้ใช้งานอยู่ใน whitelist หรือฐานข้อมูลของคุณ
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
      });

      if (!existingUser) {
        // ถ้าไม่พบในระบบ ไม่อนุญาตให้ login
        return false;
      }
      // อนุญาตให้ login
      return true;
    },
    jwt: async ({ token, user }: { token: JWT, user: User }) => {
      if (user) {
        token.id = user.id

        if (user.email) {
          const existingUser  = await prisma.user.findUnique({
            where: { email: user.email },
          });

          token.role = existingUser?.role
        }
      }

      return token
    },
    session: async ({ session, token }: {session: Session, token: JWT}) => {
      if (session?.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }

      return session
    },
    async redirect({ baseUrl }: { baseUrl: string }) {
      return `${baseUrl}/profile`
    },
  },
  pages:{
    signIn: '/auth/login'
  }
} as AuthOptions

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }