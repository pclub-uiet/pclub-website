import axios from "axios"
import { NextResponse } from "next/server"
import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark } from "@fortawesome/free-solid-svg-icons"
import toast from "react-hot-toast"

export default function AddProjectModal({ project, onClose, onAdd }: any) {
  const [formData, setFormData] = React.useState({
    title: project.title,
    desc: project.desc,
    repolink: project.repolink,
    livelink: project.livelink,
    contributors: project.contributors,
    techstack: project.techstack,
    image: project.image,
  })

  const [load, setLoad] = React.useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (
      formData.title.trim().length === 0 ||
      formData.desc.trim().length === 0 ||
      formData.repolink.trim().length === 0 ||
      formData.contributors.length === 0 ||
      formData.techstack.length === 0
    ) {
      toast.error("Please fill in all fields")
      return
    }

    try {
      setLoad(true)
      const {
        title,
        desc,
        repolink,
        livelink,
        contributors,
        techstack,
        image,
      } = formData
      const newProject = {
        title,
        desc,
        repolink,
        livelink,
        contributors,
        techstack,
        image,
      }

      const res = await axios.post("/api/project/addProject", newProject)
      const savedProject = res.data
      onAdd(savedProject)
      toast.success("Project Added!")
      onClose()
    } catch (error: any) {
      toast.error("Failed to add project")
      console.error("Add Project Error:", error.response?.data || error.message)
    } finally {
      setLoad(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-orange-300 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-orange-200 bg-orange-50 px-8 py-5">
          <h2 className="text-2xl font-bold text-orange-800">Add Project</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-orange-700 hover:text-red-500"
          >
            <FontAwesomeIcon icon={faXmark} size="lg" />
          </button>
        </div>

        <div className="max-h-[80vh] overflow-y-auto px-8 py-6">
          <form onSubmit={onSubmit} className="space-y-5">
            <input
              type="text"
              name="title"
              placeholder="Enter Title of Project"
              value={formData.title}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-5 py-3 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            <input
              type="text"
              name="desc"
              placeholder="Enter Description of Project"
              value={formData.desc}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-5 py-3 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            <input
              type="text"
              name="repolink"
              placeholder="Enter RepoLink of Project"
              value={formData.repolink}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-5 py-3 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            <input
              type="text"
              name="livelink"
              placeholder="Enter LiveLink of Project"
              value={formData.livelink}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-5 py-3 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            <input
              type="text"
              name="contributors"
              placeholder="Enter Contributors of Project"
              value={formData.contributors.join(", ")}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  contributors: e.target.value.split(",").map((s) => s.trim()),
                }))
              }
              className="w-full rounded-md border border-gray-300 px-5 py-3 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            <input
              type="text"
              name="techstack"
              placeholder="Enter TechStack of Project"
              value={formData.techstack.join(", ")}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  techstack: e.target.value.split(",").map((s) => s.trim()),
                }))
              }
              className="w-full rounded-md border border-gray-300 px-5 py-3 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            <input
              type="text"
              name="image"
              placeholder="Enter Image URL of Project"
              value={formData.image}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-5 py-3 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            {load ? (
              <div className="flex justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-4 border-orange-600 border-t-transparent"></div>
              </div>
            ) : (
              <button
                type="submit"
                className="w-full rounded-lg bg-orange-500 px-6 py-3 text-lg font-semibold text-white shadow-md transition hover:bg-orange-600"
              >
                Save Changes
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
