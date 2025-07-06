import { PrismaClient } from "@/lib/generated/prisma"
import { NextRequest, NextResponse } from "next/server"
import { getAuthSession } from "@/lib/auth"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const publishedBlogs = await prisma.blog.findMany({
      where: {
        status: "PUBLISHED",
      },
      orderBy: {
        publishedAt: "desc",
      },
    })
    return NextResponse.json(publishedBlogs, { status: 200 })
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch published blogs" },
      { status: 500 },
    )
  }
}
