import axios from "axios"
import { NextResponse } from "next/server"
import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark } from "@fortawesome/free-solid-svg-icons"
import toast from "react-hot-toast"

export default function EditProjectModal({ project, onClose, onEdit }: any) {
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

  const onUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoad(true)
      const updatedProject = await axios.put("/api/project/updateProject", {
        id: project.id,
        ...formData,
      })
      toast.success("Project updated!")
      onEdit({
        ...project,
        ...formData,
      })
      onClose()
    } catch (error: any) {
      toast.error("Failed to update project")
      console.error("Error updating project:", error)
    } finally {
      setLoad(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-orange-300 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-orange-200 bg-orange-50 px-8 py-5">
          <h2 className="text-2xl font-bold text-orange-800">Edit Project</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-gray-600 hover:text-red-500"
          >
            <FontAwesomeIcon icon={faXmark} size="lg" />
          </button>
        </div>

        <div className="max-h-[80vh] overflow-y-auto px-6 py-6">
          <form onSubmit={onUpdateProject} className="space-y-4">
            <input
              type="text"
              name="title"
              placeholder="Enter Updated Title of Project"
              value={formData.title}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-5 py-3 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            <input
              type="text"
              name="desc"
              placeholder="Enter Updated Description of Project"
              value={formData.desc}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-5 py-3 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            <input
              type="text"
              name="repolink"
              placeholder="Enter Updated RepoLink of Project"
              value={formData.repolink}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-5 py-3 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            <input
              type="text"
              name="livelink"
              placeholder="Enter Updated LiveLink of Project"
              value={formData.livelink}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-5 py-3 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            <input
              type="text"
              name="contributors"
              placeholder="Enter Updated Contributors of Project"
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
              placeholder="Enter Updated TechStack of Project"
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
              placeholder="Enter Updated Image URL of Project"
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
