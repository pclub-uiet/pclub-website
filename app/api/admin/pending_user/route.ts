import { PrismaClient } from "@/lib/generated/prisma"
import { NextResponse } from "next/server"
import { getAuthSession } from "@/lib/auth"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const session = await getAuthSession()

    // Must be logged in
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the current user from DB
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    // Only approved admins/root_admins can access
    if (
      !currentUser ||
      !currentUser.approved ||
      (currentUser.role !== "ADMIN" && currentUser.role !== "ROOT_ADMIN")
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // users pending requests to be approved by ROOT_ADMIN
    const users = await prisma.user.findMany({
      where: {
        approved: false,
        role: "USER",
      },
    })
    return NextResponse.json(users)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
