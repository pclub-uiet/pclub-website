import { PrismaClient } from "@/lib/generated/prisma"
import { NextResponse } from "next/server"
import { getAuthSession } from "@/lib/auth"

const prisma = new PrismaClient()

export async function DELETE(req: Request) {
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

    const { id } = await req.json()

    if (!id) {
      return NextResponse.json(
        { error: "Member ID is required" },
        { status: 400 },
      )
    }

    const deletedMember = await prisma.member.delete({
      where: { id },
    })

    return NextResponse.json(deletedMember, { status: 200 })
  } catch (error: any) {
    console.error("Error deleting member:", error)
    return NextResponse.json(
      { error: "Failed to delete member" },
      { status: 500 },
    )
  }
}
