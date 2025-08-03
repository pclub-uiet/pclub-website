import { PrismaClient } from "@/lib/generated/prisma"
import bcryptjs from "bcryptjs"
import { NextResponse, NextRequest } from "next/server"

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  const reqBody = await request.json()
  const { email, password } = reqBody // the password is hashed

  const user = await prisma.user.findUnique({
    where: { email },
  }) // user may be null

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 })
  }

  // const matchPassword = await bcryptjs.compare(password, user.password) ;
  // if (!matchPassword) {
  //     return NextResponse.json({ message: "Invalid password" }, { status: 401 });
  // }

  if (!user.approved) {
    return NextResponse.json({ message: "Not approved yet" }, { status: 403 })
  }

  return NextResponse.json({
    message: "Login success",
    role: user.role,
    userId: user.id,
  })
}
