import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client'
import { getToken } from "next-auth/jwt"
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  
  if (!token || token.role !== 'admin') {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const users = await prisma.user.findMany({
      omit: {
        password: true
      },
      where:{
        deleted: false
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return Response.json(users)
  } catch (error) {
    return new Response(error as BodyInit, {
      status: 500,
    })
  }
}

export async function POST(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  
  if (!token || token.role !== 'admin') {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const { name, email, password, role } = await request.json()
    const hashedPassword = bcrypt.hashSync(password, 10)
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    })
    return Response.json(newUser)
  } catch (error) {
    return new Response(error as BodyInit, {
      status: 500,
    })
  }
}

