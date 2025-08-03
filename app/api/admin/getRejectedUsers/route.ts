import { PrismaClient } from "@/lib/generated/prisma"
import { NextResponse } from "next/server"
import { getAuthSession } from "@/lib/auth"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const session = await getAuthSession()

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

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

    const rejectedUsers = await prisma.user.findMany({
      where: {
        role: "REJECTED_USER",
        approved: false,
      },
    })

    return NextResponse.json(rejectedUsers)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
