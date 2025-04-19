import { PrismaClient, Prisma } from "@prisma/client"
import { getToken } from "next-auth/jwt"
import { NextRequest } from "next/server"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {

  try {
    const searchParams = request.nextUrl.searchParams
    const keyword = searchParams.get('keyword')?.trim()
    const brandId = Number(searchParams.get('brandId') || 0)
    const whereCondition: Prisma.ProductWhereInput = {
        deleted: false 
      }
    
      if (keyword) {
        whereCondition.name = { contains: keyword, mode: 'insensitive' }
      }
    
      if (brandId && brandId != 0) {
        whereCondition.brandId = { equals: brandId }
      }

    const products = await prisma.product.findMany({
      include: {
        Brand: true,
      },
      where: whereCondition,
      orderBy: {
        createdAt: 'desc',
      }
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
