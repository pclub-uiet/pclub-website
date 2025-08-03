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

    const { id, email, branch, year } = await req.json()

    if (!id) {
      return NextResponse.json({ error: "Missing member ID" }, { status: 400 })
    }

    // console.log("Incoming ID:", id) ;

    const updatedMember = await prisma.member.update({
      where: { id },
      data: {
        email,
        branch,
        year,
      },
    })
    return NextResponse.json(updatedMember, { status: 200 })
  } catch (error: any) {
    console.error("Error updating member:", error)
    return NextResponse.json(
      { error: "Failed to update member" },
      { status: 500 },
    )
  }
}
