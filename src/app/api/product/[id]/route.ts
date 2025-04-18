import { PrismaClient } from "@prisma/client"
import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"
import fs from 'fs'
import path from 'path'
import { storage } from '@/libs/firebase-admin'

const prisma = new PrismaClient()

export async function GET(request: NextRequest, { params }: { params: { id: number } }) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  
  if (!token || token.role !== 'admin') {
    return new Response("Unauthorized", { status: 401 });
  }

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
    const { name, brandId, base64Image } = await request.json()
    let imageurl = ''

    if (base64Image) {
      const matches = base64Image.match(/^data:image\/(\w+);base64,(.+)$/)
      
      if (!matches || matches.length !== 3) {
        return NextResponse.json({ error: 'Malformed base64 string' }, { status: 400 });
      }

      const extension = matches[1]; // png, jpeg, etc.
      const base64Data = matches[2];
      const buffer = Buffer.from(base64Data, 'base64');
      const fileName = `${Date.now()}.${extension}`;

      if (process.env.STORAGE == 'firebase') {
        const bucketFile = storage.bucket().file('uploads/' + fileName);
        await bucketFile.save(buffer, {
          metadata: {
            contentType: `image/${extension}`,
          },
          public: true,
        });

        imageurl = `https://storage.googleapis.com/${bucketFile.bucket.name}/uploads/${fileName}`;
      } else {
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        const filePath = path.join(uploadDir, fileName);

        // สร้างโฟลเดอร์ถ้ายังไม่มี
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        // เขียนไฟล์ลงดิสก์
        fs.writeFileSync(filePath, buffer);

        imageurl = `uploads/${fileName}`;
      }
    }

    const updateProduct = await prisma.product.update({
      where: { id: Number(id) },
      data: { 
        name, 
        brandId: brandId == 0 ? null : brandId,
        image: imageurl == '' ? null : imageurl
      }
    })
    return Response.json(updateProduct)
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
