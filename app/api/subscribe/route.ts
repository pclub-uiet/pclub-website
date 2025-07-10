import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { randomUUID } from "crypto"
import { sendVerificationMail } from "@/lib/mailer"

const SITE_URL = process.env.SITE_URL ?? "http://localhost:3000"

/*
1. Receive POST with email
2. If no email → 400 error
3. If email already verified → return "Already subscribed 😊"
4. Generate/reuse token
5. Save/update record in DB
6. Try sending email:
   - If fails → return "Saved, but e-mail failed"
   - If success → return "Check your inbox to verify 👍"
*/

export async function POST(req: Request) {
  const { email } = await req.json()

  if (!email) {
    return NextResponse.json({ msg: "Email required" }, { status: 400 })
  }

  const existing = await prisma.subscriber.findUnique({
    where: { email },
  })

  if (existing?.isVerified) {
    return NextResponse.json({ msg: "Already subscribed 😊" })
  }

  const token = existing?.token ?? randomUUID() // Generate (or reuse) verification token

  // upsert = insert if it doesn't exist, update if it does
  await prisma.subscriber.upsert({
    where: { email },
    create: { email, token },
    update: {
      token,
      isVerified: false,
      verifiedAt: null,
    },
  })

  const verifyUrl = `${SITE_URL}/verify?token=${token}` // This link will be sent in the email

  try {
    await sendVerificationMail(email, verifyUrl)
  } catch (err: any) {
    console.error("SMTP send error:", err)
    return NextResponse.json(
      { msg: "Saved, but e-mail failed" },
      { status: 500 },
    )
  }

  return NextResponse.json({ msg: "Check your inbox to verify 👍" })
}
