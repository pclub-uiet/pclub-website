"use client"
import "../globals.css"
import { ReactNode } from "react"
import Link from "next/link"
// import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { useSelectedLayoutSegment } from "next/navigation"

import {
  LayoutDashboard,
  Users,
  Calendar,
  Folder,
  Newspaper,
} from "lucide-react"
import axios from "axios"

export default function AdminLayout({ children }: { children: ReactNode }) {
  //   const pathname = usePathname()
  const segment = useSelectedLayoutSegment()
  const [adminName, setAdminName] = useState("Admin")
  const [memImg, setMemImg] = useState<string | null>(null)
  const [imgError, setImgError] = useState(false)

  const firstLetter = adminName.charAt(0).toUpperCase()

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await axios.get("/api/me")
        if (res.data?.name) setAdminName(res.data.name)
        if (res.data?.profile_picture) setMemImg(res.data.profile_picture)
      } catch (err: any) {
        console.error("Failed to load admin info", err)
      }
    }
    fetchAdmin()
  }, [])

  const links = [
    { href: "/admin", label: "Admin", icon: <LayoutDashboard size={18} /> },
    { href: "/admin/member", label: "Members", icon: <Users size={18} /> },
    { href: "/admin/event", label: "Events", icon: <Calendar size={18} /> },
    { href: "/admin/project", label: "Projects", icon: <Folder size={18} /> },
    { href: "/admin/blog", label: "Blogs", icon: <Newspaper size={18} /> },
  ]

  return (
    <div className="flex min-h-screen animate-fade-in bg-[#f8f4f1] font-sans text-gray-900">
      <aside className="fixed left-0 top-0 z-10 flex h-screen w-64 flex-col items-center bg-[#1A2238] p-6 text-white shadow-lg">
        <div className="mb-5 mt-24 h-24 w-24 overflow-hidden rounded-full shadow-xl ring-4 ring-orange-200 transition-transform duration-300 hover:scale-105">
          {memImg && !imgError ? (
            <img
              src={memImg}
              alt="Profile Picture"
              onError={() => setImgError(true)}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-orange-500 text-3xl font-bold text-white">
              {firstLetter}
            </div>
          )}
        </div>

        <div className="mb-8 text-xl font-semibold tracking-wide text-white">
          {adminName}
        </div>
        <nav className="w-full">
          <ul className="space-y-2">
            {links.map(({ href, label, icon }) => {
              const isActive =
                (href === "/admin" && segment === null) ||
                href === `/admin/${segment}`

              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`group flex items-center gap-3 rounded-md px-4 py-3 font-medium transition-all duration-300 ${
                      isActive
                        ? "border-l-4 border-orange-400 bg-[#1F2A44] text-white shadow-sm"
                        : "text-gray-300 hover:bg-[#25304a] hover:text-white hover:brightness-110"
                    }`}
                  >
                    {icon}
                    <span className="transition-colors duration-300 group-hover:text-white">
                      {label}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </aside>

      <main className="ml-64 flex-grow animate-fade-in overflow-y-auto p-6">
        {children}
      </main>
    </div>
  )
}
