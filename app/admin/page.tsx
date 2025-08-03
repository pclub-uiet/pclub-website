"use client"
import Link from "next/link"
import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import toast from "react-hot-toast"
import { NextResponse, NextRequest } from "next/server"
import { signOut } from "next-auth/react"
import nProgress from "nprogress"

type User = {
  id: string
  name: string
  email: string
  role: string
  approved: boolean
  createdAt: string
}

export default function AdminPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [pendingUser, setPendingUser] = React.useState<User[]>([])
  const [approveUser, setApproveUser] = React.useState<User[]>([])
  const [rejectUser, setRejectUser] = React.useState<User[]>([])

  // Fetch Data from Server
  const fetchData = async () => {
    nProgress.start() // Start the progress bar
    try {
      setLoading(true)
      const pendingRes = await axios.get("/api/admin/pending_user")
      const approveRes = await axios.get("/api/admin/getApprovedUsers")
      const rejectRes = await axios.get("/api/admin/getRejectedUsers")

      setPendingUser(pendingRes.data)
      setApproveUser(approveRes.data)
      setRejectUser(rejectRes.data)
    } catch (error: any) {
      console.log(error.message)
      toast.error("Error loading admin data")
    } finally {
      setLoading(false)
      nProgress.done() // Stop the progress bar
    }
  }

  // When this page loads, it calls fetchData() once to get all the user data
  useEffect(() => {
    fetchData()
  }, [])

  const onApproveUser = async (id: string) => {
    try {
      await axios.post("/api/admin/approve_user", { id })
      toast.success("User approved")
      fetchData()
    } catch (error: any) {
      console.log(error.message)
    }
  }

  const onRejectUser = async (id: string) => {
    try {
      await axios.put("/api/admin/reject_user", { id })
      toast.success("User rejected")
      fetchData() // After we approve or reject a user, our backend (database) changes, hence reload the latest user list
    } catch (error: any) {
      console.log(error.message)
    }
  }

  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/login", // after logout, redirect to login page
    })
  }

  const SkeletonCard = () => (
    <div className="w-full max-w-md animate-pulse rounded-2xl border border-orange-200 bg-white/40 p-6 shadow backdrop-blur-md">
      <div className="mb-3 h-4 w-24 rounded bg-gray-300" />
      <div className="space-y-3 text-sm">
        <div className="h-4 w-3/4 rounded bg-gray-300" />
        <div className="h-4 w-1/2 rounded bg-gray-300" />
        <div className="h-4 w-1/3 rounded bg-gray-300" />
      </div>
      <div className="mt-6 flex gap-4">
        <div className="h-8 flex-1 rounded bg-gray-300" />
        <div className="h-8 flex-1 rounded bg-gray-300" />
      </div>
    </div>
  )

  const Card: React.FC<{ user: User; actions?: boolean }> = ({
    user,
    actions,
  }) => {
    return (
      <div className="relative w-full max-w-md rounded-2xl border border-orange-200 bg-white/60 p-6 shadow-xl backdrop-blur-md transition duration-300 hover:scale-[1.02]">
        <div className="absolute right-3 top-3 text-xs text-gray-400">
          {new Date(user.createdAt).toLocaleDateString()}
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2 text-gray-700">
            <span className="text-lg font-semibold text-orange-700">👤</span>
            <span>
              <span className="font-semibold text-gray-900">Name:</span>{" "}
              {user.name || "Unknown"}
            </span>
          </div>

          <div className="flex items-center gap-2 text-gray-700">
            <span className="text-lg font-semibold text-orange-700">✉</span>
            <span>
              <span className="font-semibold text-gray-900">Email:</span>{" "}
              {user.email}
            </span>
          </div>

          <div className="flex items-center gap-2 text-gray-700">
            <span className="text-lg font-semibold text-orange-700">🔑</span>
            <span>
              <span className="font-semibold text-gray-900">Role:</span>{" "}
              {user.role}
            </span>
          </div>
        </div>

        {actions && (
          <div className="mt-6 flex gap-4">
            <button
              onClick={() => onApproveUser(user.id)}
              className="flex-1 rounded-xl bg-green-500 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-green-600"
            >
              Approve
            </button>
            <button
              onClick={() => onRejectUser(user.id)}
              className="flex-1 rounded-xl bg-red-500 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-red-600"
            >
              Reject
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-rose-50 px-6 pb-12 pt-5">
      <div className="mx-auto w-full max-w-6xl space-y-16">
        <div className="flex items-center justify-between rounded-xl bg-white/80 px-6 py-4 shadow-sm ring-1 ring-orange-100 backdrop-blur-sm">
          <h1 className="text-xl font-semibold tracking-wide text-orange-800">
            Admin Access Panel
          </h1>
          <button
            onClick={handleLogout}
            className="rounded-lg bg-red-600 px-5 py-2 text-sm font-medium text-white shadow transition hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        <section>
          <h2 className="mb-6 border-l-4 border-orange-400 pl-4 text-3xl font-bold tracking-tight text-orange-900">
            Pending Requests
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
            ) : pendingUser.length ? (
              pendingUser.map((user) => (
                <Card key={user.id} user={user} actions />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-600">
                No pending requests
              </p>
            )}
          </div>
        </section>

        <section>
          <h2 className="mb-6 border-l-4 border-orange-400 pl-4 text-3xl font-bold tracking-tight text-orange-900">
            Approved Admins
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
            ) : approveUser.length ? (
              approveUser.map((user) => <Card key={user.id} user={user} />)
            ) : (
              <p className="col-span-full text-center text-gray-600">
                No admins yet
              </p>
            )}
          </div>
        </section>

        <section>
          <h2 className="mb-6 border-l-4 border-orange-400 pl-4 text-3xl font-bold tracking-tight text-orange-900">
            Rejected Users
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
            ) : rejectUser.length ? (
              rejectUser.map((user) => <Card key={user.id} user={user} />)
            ) : (
              <p className="col-span-full text-center text-gray-600">
                No rejected users
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
