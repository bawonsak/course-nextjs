import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client'
import { getToken } from "next-auth/jwt"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  
  if (!token || token.role !== 'admin') {
    return new Response("Unauthorized", { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams
  console.log(searchParams, searchParams)

  try {
    const users = await prisma.user.findMany({
      omit: {
        password: true
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