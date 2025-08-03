import { getServerSession } from "next-auth/next"
import { authOptions } from "./authOptions"
import type { Session } from "next-auth"

export const getAuthSession = async (): Promise<Session | null> => {
  const session = await getServerSession(authOptions)
  return session as unknown as Session | null
}
