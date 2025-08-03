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

    const res = await req.json()
    const { id, title, desc, eventType, status, speaker, date, location } = res

    if (!id) {
      return NextResponse.json({ error: "Missing event ID" }, { status: 400 })
    }

    const correctStatus =
      status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() // e.g.- Upcoming

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        title,
        desc,
        eventType,
        status: correctStatus as any,
        speaker,
        date: new Date(date),
        location,
      },
    })
    return NextResponse.json(updatedEvent, { status: 200 })
  } catch (error: any) {
    console.error("Error updating event:", error)
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 },
    )
  }
}
