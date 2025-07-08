import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { randomUUID } from "crypto"
import { sendVerificationMail } from "@/lib/mailer"

const SITE_URL = process.env.SITE_URL ?? "http://localhost:3000"

export async function POST(req: Request) {
  const { email } = await req.json()
  if (!email)
    return NextResponse.json({ msg: "Email required" }, { status: 400 })

  const existing = await prisma.subscriber.findUnique({ where: { email } })
  if (existing?.isVerified)
    return NextResponse.json({ msg: "Already subscribed 😊" })

  const token = existing?.token ?? randomUUID()

  await prisma.subscriber.upsert({
    where: { email },
    create: { email, token },
    update: { token, isVerified: false, verifiedAt: null },
  })

  const verifyUrl = `${SITE_URL}/verify?token=${token}`
  try {
    await sendVerificationMail(email, verifyUrl)
  } catch (err) {
    console.error("SMTP send error:", err)
    return NextResponse.json(
      { msg: "Saved, but e-mail failed" },
      { status: 500 },
    )
  }

  return NextResponse.json({ msg: "Check your inbox to verify 👍" })
}
