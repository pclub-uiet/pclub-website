import { PrismaClient } from "@/lib/generated/prisma"
import { NextResponse, NextRequest } from "next/server"
import { getAuthSession } from "@/lib/auth"

const prisma = new PrismaClient()

export async function PUT(req: NextRequest) {
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

    const {
      id,
      title,
      desc,
      repolink,
      livelink,
      contributors,
      techstack,
      image,
    } = await req.json()

    const updatedProject = await prisma.project.update({
      where: { id },
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
    return NextResponse.json(updatedProject, { status: 200 })
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 },
    )
  }
}
