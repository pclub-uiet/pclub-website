import { PrismaClient } from "@/lib/generated/prisma"
import { NextResponse } from "next/server"
import { getAuthSession } from "@/lib/auth"
const prisma = new PrismaClient()

export async function GET() {
  try {
    const session = await getAuthSession()

    // Ensure only authenticated users can access this route
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    // Allow only approved ADMIN or ROOT_ADMIN
    if (
      !currentUser ||
      !currentUser.approved ||
      (currentUser.role !== "ADMIN" && currentUser.role !== "ROOT_ADMIN")
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const admins = await prisma.user.findMany({
      where: {
        approved: true,
        role: "ADMIN",
      },
    })

    return NextResponse.json(admins)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
