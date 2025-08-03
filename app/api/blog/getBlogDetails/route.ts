import { PrismaClient } from "@/lib/generated/prisma"
import { NextRequest, NextResponse } from "next/server"
// import { getAuthSession } from "@/lib/auth"

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "Blog ID is required" }, { status: 400 })
  }

  try {
    const blog = await prisma.blog.findUnique({
      where: { id },
    })

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }
    return NextResponse.json(blog, { status: 200 })
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch blog details" },
      { status: 500 },
    )
  }
}
