import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {

  try {
    const brands = await prisma.brand.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
    return Response.json(brands)
  } catch (error) {
    return new Response(error as BodyInit, {
      status: 500,
    })
  }
}