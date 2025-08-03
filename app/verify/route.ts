import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

const SITE_URL = process.env.SITE_URL ?? "http://localhost:3000"

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token")
  if (!token) return NextResponse.redirect(`${SITE_URL}/verify/fail`)

  const sub = await prisma.subscriber.findFirst({ where: { token } })
  if (!sub) return NextResponse.redirect(`${SITE_URL}/verify/fail`)

  await prisma.subscriber.update({
    where: { id: sub.id },
    data: { isVerified: true, verifiedAt: new Date() },
  })

  return NextResponse.redirect(`${SITE_URL}/verify/success`)
}
