import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { Navbar } from "@/components/layout/navbar"
import { ThemeProvider } from "@/components/layout/theme-provider"
import { Toaster } from "react-hot-toast"
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Shadcn - Landing template",
  description: "Landing template from Shadcn",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body className={cn("bg-background min-h-screen", inter.className)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <Toaster position="top-right" reverseOrder={false} />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
