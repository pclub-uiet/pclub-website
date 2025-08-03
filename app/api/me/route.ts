import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import { NextResponse } from "next/server"
import { PrismaClient } from "@/lib/generated/prisma"

const prisma = new PrismaClient()

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 })
  }

  try {
    const member = await prisma.member.findUnique({
      where: { email: session.user.email },
      select: { profile_picture: true },
    })

    return NextResponse.json({
      name: user.name,
      email: user.email,
      profile_picture: member?.profile_picture ?? null,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 },
    )
  }
}
