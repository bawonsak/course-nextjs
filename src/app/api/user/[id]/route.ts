import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client'
import { getToken } from "next-auth/jwt"

const prisma = new PrismaClient()

export async function GET(request: NextRequest, { params }: { params: { id: number } },) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  
  if (!token || token.role !== 'admin') {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    return Response.json(await prisma.user.findFirst({
      where: { id: Number(params.id), deleted: false },
      omit: {
        password: true
      }
    }))
  } catch (error) {
    return new Response(error as BodyInit, {
      status: 500,
    })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: number } },) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  
  if (!token || token.role !== 'admin') {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    return Response.json(await prisma.user.update({
      where: { id: Number(params.id) },
      data: { deleted: true }
    }))
  } catch (error) {
    return new Response(error as BodyInit, {
      status: 500,
    })
  }
}