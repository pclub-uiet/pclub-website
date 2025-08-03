"use client" // For frontend part - useState, useEffect, window, etc.

import Link from "next/link"
import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import toast from "react-hot-toast"
import { NextResponse } from "next/server"

export default function Signup() {
  const router = useRouter()

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  })

  const [load, setLoad] = useState(false)
  // const [error, setError] = useState(false) ;

  const onSignup = async () => {
    if (!user.name || !user.email || !user.password) {
      toast.error("Please fill all fields")
      return
    }

    try {
      setLoad(true)
      const response = await axios.post("/api/admin/request_access", user)
      console.log("Request sent", response.data)
      toast.success("Request sent. Await admin approval.")

      // Clear the form only on success
      setUser({
        name: "",
        email: "",
        password: "",
      })
    } catch (error: any) {
      console.log("Signup failed", error.message)
      toast.error("Signup failed")
    } finally {
      setLoad(false)
    }
  }

  return (
    <div className="flex h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-orange-50 via-pink-50 to-rose-50 px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-white/20 bg-white/40 p-10 shadow-2xl backdrop-blur-sm">
        <h2 className="mb-6 text-center text-4xl font-bold tracking-tight text-amber-900">
          Sign Up
        </h2>

        <div className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-800"
            >
              Name
            </label>
            <input
              className="mt-1 w-full rounded-lg border border-orange-300 bg-white/80 px-4 py-2 shadow-inner focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-300"
              type="text"
              id="name"
              name="name"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-800"
            >
              Email
            </label>
            <input
              className="mt-1 w-full rounded-lg border border-orange-300 bg-white/80 px-4 py-2 shadow-inner focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-300"
              type="email"
              id="email"
              name="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-800"
            >
              Password
            </label>
            <input
              className="mt-1 w-full rounded-lg border border-orange-300 bg-white/80 px-4 py-2 shadow-inner focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-300"
              type="password"
              id="password"
              name="password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              placeholder="Enter your password"
            />
          </div>

          <button
            disabled={load}
            className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-red-500 py-2 font-semibold text-white shadow-md transition duration-200 hover:from-orange-600 hover:to-red-600 disabled:opacity-60"
            onClick={onSignup}
          >
            {!load ? "Signup" : "Processing"}
          </button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-orange-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
