import { PrismaClient, Prisma } from "@prisma/client"
import { getToken } from "next-auth/jwt"
import { NextRequest } from "next/server"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {

  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  
    if (!token) {
      return new Response("Unauthorized", { status: 401 });
    }

    const whereCondition: Prisma.CartWhereInput = {
      status: 'active',
      userId: Number(token.id)
    }

    const cart = await prisma.cart.findFirst({
      include: {
        CartItems: {
          where: {
            deleted: false
          },
          include: {
            Product: true
          }
        }
      },
      where: whereCondition
    })

    if (cart == null) {
      return new Response(null, { status: 404 });
    }

    return Response.json(cart)
  } catch (error) {
    return new Response(error as BodyInit, {
      status: 500,
    })
  }
}

export async function POST(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  
  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const { productId, qty } = await request.json()
    const currentCart = await prisma.cart.findFirst({ where: { userId: Number(token.id) } })

    const cart = await prisma.cart.upsert({
      where: { id: currentCart?.id || 0 },
      update: { updatedAt: new Date() },
      create: { userId: Number(token.id), status: 'active' },
    })

    const currentProduct = await prisma.cartItems.findFirst({
      where: {
        cartId: cart.id,
        productId,
        deleted: false
      }
    })
    await prisma.cartItems.upsert({
      where: {
        id: currentProduct?.id || 0
      },
      update: {
        qty: { increment: 1 },
        updatedAt: new Date()
      },
      create: {
        cartId: cart.id,
        productId,
        qty,
        deleted: false
      },
    });

    return Response.json(cart)
  } catch (error) {
    return new Response(error as BodyInit, {
      status: 500,
    })
  }
}
