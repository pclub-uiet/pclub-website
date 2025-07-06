// import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/prisma"
import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import bcryptjs from "bcryptjs"

export const authOptions: NextAuthOptions = {
  // adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt", // use JWT for session
    maxAge: 1 * 24 * 60 * 60 * 1000, // sets the JWT session to expire after exactly 1 day
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // check that credentials are provided
        if (!credentials?.email || !credentials.password) {
          throw new Error("Missing email or password")
        }

        // find user by email in db
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user) throw new Error("No user found")
        if (!user.password) throw new Error("No password set for this user")

        // compare provided password with hashed password in db
        // bcryptjs.compare returns a promise that resolves to true/false
        const isPasswordValid = await bcryptjs.compare(
          credentials.password,
          user.password,
        )

        if (!isPasswordValid) throw new Error("Invalid password")
        if (!user.approved) throw new Error("User not approved")

        return user // return user object if everything is valid
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),

    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],

  // signIn() callback controls whether to accept or block them
  callbacks: {
    async signIn({ user, account }) {
      // console.log("SIGN IN CALLBACK:", { user, account })

      // apply this logic to OAuth (Google/GitHub) logins, not credentials
      if (account?.provider !== "credentials") {
        // Try to find an existing user in our database using the email returned by OAuth provider
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email ?? undefined },
        })

        if (!dbUser) {
          // Create a pending user with no password
          await prisma.user.create({
            data: {
              email: user.email!,
              name: user.name ?? "",
              role: "USER",
              approved: false,
            },
          })
          return false // block until admin approves
        }

        if (!dbUser.approved) {
          return false // If the user exists but not approved, still block the login
        }

        // Block if user signed up via credentials
        if (dbUser.password) {
          return false
        }

        return true
      }
      return true // Allow the sign-in to proceed
    },

    async jwt({ token, user }) {
      // Always fetch the latest user data on every JWT callback
      const dbUser = await prisma.user.findUnique({
        where: { email: token.email ?? user?.email ?? undefined },
      })

      if (!dbUser) {
        throw new Error("User no longer exists in DB")
      }

      token.id = dbUser.id
      token.role = dbUser.role
      token.email = dbUser.email
      token.approved = dbUser.approved

      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.approved = token.approved
      }
      return session
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
}
