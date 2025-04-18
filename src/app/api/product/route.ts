import { PrismaClient } from "@prisma/client"
import { getToken } from "next-auth/jwt"
import { NextRequest } from "next/server"

const prisma = new PrismaClient()

export async function GET() {

  try {
    const products = await prisma.product.findMany({
      include: {
        Brand: true,
      },
      where: {
        deleted: false
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return Response.json(products)
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
    const { name, brandId } = await request.json()
    const newProduct = await prisma.product.create({
      data: {
        name,
        brandId: brandId === 0 ? null : brandId,
      },
    })
    return Response.json(newProduct)
  } catch (error) {
    return new Response(error as BodyInit, {
      status: 500,
    })
  }
}
