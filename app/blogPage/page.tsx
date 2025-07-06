"use client"
import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import axios from "axios"
import Image from "next/image"
import Link from "next/link"

type BlogStatus = "DRAFT" | "PUBLISHED"

interface Blog {
  id: string
  title: string
  content: string
  desc: string
  coverImage: string
  tags: string[]
  author: string
  status: BlogStatus
  publishedAt: string
}

export default function BlogPage() {
  const router = useRouter()
  const [publishedBlogs, setPublishedBlogs] = useState<Blog[]>([])
  const [selectedTag, setSelectedTag] = useState<string>("All")

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get("/api/blog/getPublishedBlogs")
        setPublishedBlogs(res.data)
      } catch (error: any) {
        console.log(error.message)
        toast.error("Failed to fetch published blogs")
      }
    }
    fetchBlogs()
  }, [])

  const filteredBlogs = publishedBlogs.filter(
    (blog) => selectedTag === "All" || blog.tags.includes(selectedTag),
  )

  const Card: React.FC<{ blog: Blog }> = ({ blog }) => {
    return (
      <div className="group flex min-h-[400px] flex-col justify-between overflow-hidden rounded-2xl border border-[#5a3c88] bg-[#2b223d] shadow-md transition-all duration-300 hover:shadow-lg">
        {blog.coverImage && (
          <div className="relative h-48 w-full">
            <Image
              src={blog.coverImage}
              alt={`${blog.title} cover image`}
              fill
              className="object-cover"
            />
          </div>
        )}

        <div className="flex flex-1 flex-col justify-between gap-3 p-5">
          <div className="space-y-2">
            <h3 className="line-clamp-2 text-xl font-bold text-white">
              {blog.title}
            </h3>
            <p className="line-clamp-3 text-sm text-gray-300">{blog.desc}</p>

            {/* Tags */}
            <div className="mt-2 flex flex-wrap gap-2 text-xs font-medium">
              {blog.tags.map((tag, index) => (
                <span
                  key={index}
                  className="rounded-full bg-purple-800/20 px-2 py-0.5 text-purple-200"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Read More Link */}
          <div className="mt-auto pt-2">
            <Link
              href={`/blogPage/${blog.id}`}
              className="inline-block text-sm font-semibold text-pink-400 transition-all hover:underline"
            >
              Read more →
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#141629] px-6 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center">
        <h2 className="mb-3 animate-fade-in bg-gradient-to-r from-pink-400 via-purple-400 to-blue-500 bg-clip-text text-center text-4xl font-extrabold text-transparent">
          Our Blogs
        </h2>

        <p className="mb-8 max-w-2xl animate-fade-in text-center text-gray-300 delay-100">
          Discover our latest insights and creative explorations in technology,
          design, and AI.
        </p>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="mb-10 flex w-full max-w-xl animate-fade-in gap-3 delay-200"
        >
          <input
            type="email"
            placeholder="Enter your email"
            name="subscribe"
            className="flex-1 rounded-lg border border-gray-700 bg-white/10 px-4 py-3 text-sm text-white placeholder-gray-400 shadow-md focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <button
            type="submit"
            className="rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:brightness-110"
          >
            Subscribe
          </button>
        </form>

        <div className="mb-10 flex animate-fade-in flex-wrap justify-center gap-3 delay-300">
          {["All", "AI", "ML", "WebDev", "Data Science"].map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
                selectedTag === tag
                  ? "border-transparent bg-gradient-to-r from-pink-500 to-indigo-500 text-white shadow-md"
                  : "border-gray-700 bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="grid w-full grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBlogs.map((blog: Blog) => (
            <Card key={blog.id} blog={blog} />
          ))}
        </div>

        {filteredBlogs.length === 0 && (
          <p className="mt-10 text-center text-gray-400">
            No blogs found for this tag.
          </p>
        )}
      </div>
    </div>
  )
}
