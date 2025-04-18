import { PrismaClient } from "@prisma/client"
import { getToken } from "next-auth/jwt"
import { NextRequest } from "next/server"

const prisma = new PrismaClient()

export async function GET(request: NextRequest, { params }: { params: { id: number } },) {
  try {
    const { id } = await params
    const product = await prisma.product.findFirst({
      include: {
        Brand: true,
      },
      where: { id: Number(id), deleted: false },
      orderBy: {
        createdAt: 'desc',
      },
    })

    if (product == null) {
      return new Response("Not found", { status: 404 });
    }

    return Response.json(product)
  } catch (error) {
    return new Response(error as BodyInit, {
      status: 500,
    })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: number } },) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  
  if (!token || token.role !== 'admin') {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const { id } = await params
    const { name, brandId } = await request.json()
    const newProduct = await prisma.product.update({
      where: { id: Number(id) },
      data: { 
        name, 
        brandId: brandId == 0 ? null : brandId 
      }
    })
    return Response.json(newProduct)
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
    return Response.json(await prisma.product.update({
      where: { id: Number(params.id) },
      data: { deleted: true }
    }))
  } catch (error) {
    return new Response(error as BodyInit, {
      status: 500,
    })
  }
}
