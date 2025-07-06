"use client"
import React, { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import axios from "axios"
import toast from "react-hot-toast"
import Image from "next/image"
import Link from "next/link"
import { faInstagram } from "@fortawesome/free-brands-svg-icons"
import { faLinkedin } from "@fortawesome/free-brands-svg-icons"
import { faTwitter } from "@fortawesome/free-brands-svg-icons"
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons"
import { faPenNib } from "@fortawesome/free-solid-svg-icons"
import { faCalendar } from "@fortawesome/free-solid-svg-icons"
import { faBookOpen } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

// Utility to calculate estimated reading time
const getReadingTime = (text: string): string => {
  const wordsPerMinute = 200
  const words = text.trim().split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  return `${minutes} min read`
}

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

export default function BlogDetailPage() {
  const { id } = useParams()
  const [blogs, setBlogs] = useState<Blog | null>(null)
  const [shareUrl, setShareUrl] = useState("")

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get("/api/blog/getBlogDetails", {
          params: { id },
        })
        setBlogs(res.data)
        // toast.success("Blog details fetched successfully")
      } catch (error: any) {
        console.error(error.message)
        toast.error("Failed to fetch blog details")
      }
    }
    if (id) fetchBlog()
  }, [id])

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href)
    }
  }, [])

  if (!blogs) return <div className="p-10 text-center">Loading...</div>

  return (
    <div className="min-h-screen bg-[#141629] px-6 py-12 text-gray-200">
      <div className="mx-auto max-w-4xl animate-fade-in space-y-10">
        {/* Meta Info + Tags */}
        <div className="flex flex-col justify-between gap-4 text-sm text-gray-400 sm:flex-row sm:items-center">
          <div className="space-x-4">
            <span>
              <FontAwesomeIcon icon={faPenNib} className="mr-1 text-pink-400" />
              {blogs.author}
            </span>
            <span>
              <FontAwesomeIcon
                icon={faCalendar}
                className="mr-1 text-purple-400"
              />
              {new Date(blogs.publishedAt).toDateString()}
            </span>
            <span className="italic text-gray-500">
              <FontAwesomeIcon
                icon={faBookOpen}
                className="mr-1 text-indigo-400"
              />
              {getReadingTime(blogs.content)}
            </span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {blogs.tags.map((tag, idx) => (
              <span
                key={idx}
                className="rounded-full bg-purple-800/20 px-3 py-1 text-xs font-medium text-purple-200"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Title */}
        <h2 className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-center text-4xl font-extrabold tracking-tight text-transparent drop-shadow-lg">
          {blogs.title}
        </h2>

        {/* Cover Image */}
        {blogs.coverImage && (
          <div className="relative h-72 w-full overflow-hidden rounded-lg border border-white/10 bg-white/5 shadow-md">
            <Image
              src={blogs.coverImage}
              alt={`${blogs.title} cover image`}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Overview */}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-white">Overview</h3>
          <p className="animate-fade-up leading-relaxed text-gray-300">
            {blogs.desc}
          </p>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-white">Content</h3>
          <article className="prose prose-invert prose-lg max-w-none animate-fade-up text-gray-300">
            <p className="whitespace-pre-line">{blogs.content}</p>
          </article>
        </div>

        {/* Share */}
        <div className="mt-5 flex">
          <span className="mr-4 block text-sm font-semibold text-gray-400">
            Share this blog
          </span>
          <div className="flex gap-4 text-lg text-pink-500">
            <a
              href={`https://www.instagram.com/?url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Share on Instagram"
              className="transition hover:text-pink-500"
            >
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Share on LinkedIn"
              className="transition hover:text-blue-500"
            >
              <FontAwesomeIcon icon={faLinkedin} />
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(blogs.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Share on Twitter"
              className="transition hover:text-sky-500"
            >
              <FontAwesomeIcon icon={faTwitter} />
            </a>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(blogs.title + " " + shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Share on WhatsApp"
              className="transition hover:text-green-500"
            >
              <FontAwesomeIcon icon={faWhatsapp} />
            </a>
          </div>
        </div>

        {/* Back Button */}
        <div className="pt-6 text-center">
          <Link
            href="/blogPage"
            className="inline-block rounded-full bg-white/10 px-5 py-2 text-sm font-medium text-white shadow-md transition-all hover:bg-white/20 hover:shadow-lg"
          >
            ← Back to Blogs
          </Link>
        </div>
      </div>
    </div>
  )
}
