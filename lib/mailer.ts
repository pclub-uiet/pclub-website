import nodemailer from "nodemailer"
import prisma from "@/lib/prisma" // <-- Add this line if not already there

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

// Email for subscription verification
export async function sendVerificationMail(to: string, verifyUrl: string) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: "Confirm your subscription",
    html: `
      <p>Hey! Click below to verify your email address 👇</p>
      <p><a href="${verifyUrl}">${verifyUrl}</a></p>
    `,
  })
}

// Email blast to all verified subscribers
export async function sendBlogPublishedMail(blog: {
  title: string
  id: string
  slug?: string
  desc?: string
}) {
  const SITE_URL = process.env.SITE_URL ?? "http://localhost:3000"
  const link =
    blog.slug && blog.slug.length > 0
      ? `${SITE_URL}/blogPage/${blog.slug}`
      : `${SITE_URL}/blogPage/${blog.id}`

  const subscribers = await prisma.subscriber.findMany({
    where: { isVerified: true },
    select: { email: true },
  })

  await Promise.all(
    subscribers.map((s) =>
      transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: s.email,
        subject: `📰 New Blog: ${blog.title}`,
        html: `
          <h2>${blog.title}</h2>
          ${blog.desc ? `<p>${blog.desc}</p>` : ""}
          <p><a href="${link}">Read more →</a></p>
        `,
      }),
    ),
  )
}
