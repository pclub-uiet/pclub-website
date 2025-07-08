import { PrismaClient } from "@/lib/generated/prisma"
import { NextResponse, NextRequest } from "next/server"

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    // const authHeader = req.headers.get("n8n-secret")  // name in header parameters in n8n workflow
    // if (authHeader !== process.env.N8N_SECRET) {
    //     return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // }

    const res = await req.json()
    const { title, desc, content, tags, author, status, source } = res

    // prevent duplicates
    const existing = await prisma.blog.findFirst({
      where: {
        title,
        source: "automated",
      },
    })

    if (existing) {
      console.log(`Skipped duplicate blog: ${title}`)
      return NextResponse.json(
        { message: "Duplicate blog skipped" },
        { status: 200 },
      )
    }

    const newBlog = await prisma.blog.create({
      data: {
        title,
        desc,
        content,
        tags: tags || [],
        author,
        status: "DRAFT",
        source: "automated",
      },
    })
    return NextResponse.json(newBlog, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
