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
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons"
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
  const [loading, setLoading] = useState(true)
  const [shareUrl, setShareUrl] = useState("")

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true)
        const res = await axios.get("/api/blog/getBlogDetails", {
          params: { id },
        })
        setBlogs(res.data)
        // toast.success("Blog details fetched successfully")
      } catch (error: any) {
        console.error(error.message)
        toast.error("Failed to fetch blog details")
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchBlog()
  }, [id])

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href)
    }
  }, [])

  const SkeletonBlogDetail = () => (
    <div className="animate-pulse space-y-6">
      <div className="h-6 w-1/2 rounded bg-gray-700" />
      <div className="h-5 w-1/3 rounded bg-gray-700" />
      <div className="h-72 w-full rounded-lg bg-gray-700" />
      <div className="space-y-2">
        <div className="h-6 w-1/4 rounded bg-gray-700" />
        <div className="h-4 w-full rounded bg-gray-700" />
        <div className="h-4 w-5/6 rounded bg-gray-700" />
        <div className="h-4 w-4/6 rounded bg-gray-700" />
      </div>

      <div className="space-y-2">
        <div className="h-6 w-1/4 rounded bg-gray-700" />
        <div className="h-4 w-full rounded bg-gray-700" />
        <div className="h-4 w-5/6 rounded bg-gray-700" />
        <div className="h-4 w-4/6 rounded bg-gray-700" />
        <div className="h-4 w-3/6 rounded bg-gray-700" />
      </div>

      <div className="mt-10 flex gap-4">
        <div className="h-10 w-24 rounded bg-gray-700" />
        <div className="h-10 w-24 rounded bg-gray-700" />
      </div>
    </div>
  )

  if (loading || !blogs) {
    return (
      <div className="min-h-screen bg-[#141629] px-6 py-12 text-gray-200">
        <div className="mx-auto max-w-4xl animate-fade-in space-y-10">
          <SkeletonBlogDetail />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#141629] px-6 py-12 text-gray-200">
      <div className="mx-auto max-w-4xl animate-fade-in space-y-10">
        <div className="flex flex-col gap-4 text-sm text-gray-400 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-pink-400">
              <FontAwesomeIcon icon={faPenNib} />
              <span className="font-medium text-gray-300">{blogs.author}</span>
            </div>

            <div className="flex items-center gap-2 text-purple-400">
              <FontAwesomeIcon icon={faCalendarDays} />
              <span className="font-medium text-gray-300">
                {new Date(blogs.publishedAt).toDateString()}
              </span>
            </div>

            <div className="flex items-center gap-2 text-indigo-400">
              <FontAwesomeIcon icon={faBookOpen} />
              <span className="font-medium text-gray-300">
                {getReadingTime(blogs.content)}
              </span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {blogs.tags.map((tag, idx) => (
              <span
                key={idx}
                className="rounded-full border border-purple-500 bg-purple-800/20 px-3 py-1 text-xs font-medium text-purple-200 shadow-sm transition hover:shadow-[0_0_10px_2px_rgba(168,85,247,0.5)]"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        <h2 className="relative mb-6 text-center text-3xl font-semibold tracking-tight text-indigo-100 sm:text-4xl">
          {blogs.title}
          <span className="mx-auto mt-2 block h-1 w-24 rounded bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 opacity-80"></span>
        </h2>

        {blogs.coverImage && (
          <div className="relative h-72 w-full overflow-hidden rounded-lg border border-white/10 bg-white/5 shadow-md">
            <Image
              src={blogs.coverImage}
              alt={`${blogs.title} cover image`}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="space-y-2">
          <h3 className="inline-block border-b-2 border-orange-400 pb-1 text-2xl font-bold text-white">
            Overview
          </h3>
          <p className="animate-fade-up text-justify leading-relaxed tracking-wide text-gray-300">
            {blogs.desc}
          </p>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h3 className="inline-block border-b-2 border-orange-400 pb-1 text-2xl font-bold text-white">
            Content
          </h3>
          <article className="prose prose-lg prose-invert max-w-none animate-fade-up leading-relaxed tracking-wide text-gray-300">
            <p className="whitespace-pre-line">{blogs.content}</p>
          </article>
        </div>

        {/* Share */}
        <div className="mt-10 border-t border-white/10 pt-6">
          <h4 className="mb-3 text-sm font-semibold tracking-wider text-gray-400">
            Share this blog
          </h4>
          <div className="flex flex-wrap gap-4 text-xl">
            <a
              href={`https://www.instagram.com/?url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share this blog on Instagram"
              title="Share on Instagram"
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-pink-400 px-4 py-2 text-white shadow-md transition hover:brightness-105"
            >
              <FontAwesomeIcon icon={faInstagram} />
              <span className="text-sm font-medium">Instagram</span>
            </a>

            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Share on LinkedIn"
              aria-label="Share this blog on LinkedIn"
              className="flex items-center gap-2 rounded-full bg-blue-700 px-4 py-2 text-white shadow-md transition hover:brightness-105"
            >
              <FontAwesomeIcon icon={faLinkedin} />
              <span className="text-sm font-medium">LinkedIn</span>
            </a>

            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(blogs.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Share on Twitter"
              aria-label="Share this blog on Twitter"
              className="flex items-center gap-2 rounded-full bg-sky-500 px-4 py-2 text-white shadow-md transition hover:brightness-105"
            >
              <FontAwesomeIcon icon={faTwitter} />
              <span className="text-sm font-medium">Twitter</span>
            </a>

            <a
              href={`https://wa.me/?text=${encodeURIComponent(blogs.title + " " + shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Share on WhatsApp"
              aria-label="Share this blog on WhatsApp"
              className="flex items-center gap-2 rounded-full bg-green-600 px-4 py-2 text-white shadow-md transition hover:brightness-105"
            >
              <FontAwesomeIcon icon={faWhatsapp} />
              <span className="text-sm font-medium">WhatsApp</span>
            </a>
          </div>
        </div>

        <div className="pt-6 text-center">
          <Link
            href="/blog"
            className="mt-6 inline-block rounded-full bg-white/10 px-6 py-2 text-sm font-medium text-white shadow-md transition-all hover:bg-white/20 hover:shadow-lg"
          >
            ← Back to Blogs
          </Link>
        </div>
      </div>
    </div>
  )
}
