import { PrismaClient } from "@/lib/generated/prisma"
import { NextResponse, NextRequest } from "next/server"
import { getAuthSession } from "@/lib/auth"
import { sendBlogPublishedMail } from "@/lib/mailer"

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const session = await getAuthSession()

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get current user (admin making the request)
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    // Allow only approved admins or root admins
    if (
      !currentUser ||
      !currentUser.approved ||
      (currentUser.role !== "ADMIN" && currentUser.role !== "ROOT_ADMIN")
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const res = await req.json()
    const { title, desc, content, coverImage, tags, author, status } = res

    // const correctStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()

    let publishedAt = null
    if (status === "PUBLISHED") {
      publishedAt = new Date().toISOString()
    }

    const newBlog = await prisma.blog.create({
      data: {
        title,
        desc,
        content,
        coverImage,
        tags,
        author,
        status,
        publishedAt,
      },
    })

    // Send email notification if blog is published
    if (newBlog.status === "PUBLISHED") {
      sendBlogPublishedMail(newBlog).catch((err) =>
        console.error("Failed to send blog published email:", err),
      )
    }

    return NextResponse.json(newBlog, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
