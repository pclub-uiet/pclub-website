import { PrismaClient } from "@/lib/generated/prisma"
import { NextResponse, NextRequest } from "next/server"
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

    const body = await req.json()
    const {
      title,
      desc,
      eventType,
      bannerImage,
      registerLink,
      status,
      organizer,
      speaker,
      recordLink,
      date,
      location,
    } = body

    const correctStatus =
      status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() // e.g.- Upcoming

    const newEvent = await prisma.event.create({
      data: {
        title,
        desc,
        eventType,
        bannerImage,
        registerLink,
        status: correctStatus as any,
        organizer,
        speaker,
        recordLink,
        date: new Date(date),
        location,
      },
    })

    return NextResponse.json(newEvent, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
