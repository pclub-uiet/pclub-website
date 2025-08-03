import { PrismaClient } from "@/lib/generated/prisma"
import { NextRequest, NextResponse } from "next/server"
import { getAuthSession } from "@/lib/auth"

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthSession()

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch user from DB
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (
      !currentUser ||
      !currentUser.approved ||
      (currentUser.role !== "ADMIN" && currentUser.role !== "ROOT_ADMIN")
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { id } = await request.json()

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 })
    }

    // approve the user request and made them a admin
    await prisma.user.update({
      where: { id },
      data: { approved: true, role: "ADMIN" },
    })

    return NextResponse.json(
      { message: "User approved and updated" },
      { status: 200 },
    )
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
