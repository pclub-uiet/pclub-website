import { PrismaClient } from "@/lib/generated/prisma"
import { NextRequest, NextResponse } from "next/server"
import { getAuthSession } from "@/lib/auth"

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
    const { title, desc, repolink, livelink, contributors, techstack, image } =
      res

    const newProject = await prisma.project.create({
      data: {
        title,
        desc,
        repolink,
        livelink,
        contributors,
        techstack,
        image,
      },
    })
    return NextResponse.json(newProject, { status: 200 })
  } catch (error: any) {
    console.error("Add Project Error:", error.response?.data || error.message)
    return NextResponse.json(
      { error: "Failed to add project" },
      { status: 500 },
    )
  }
}
