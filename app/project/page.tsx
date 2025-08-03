"use client"
import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import axios from "axios"
import { NextResponse, NextRequest } from "next/server"
import Image from "next/image"
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import AddProjectModal from "@/components/ui/AddProjectModal"
import EditProjectModal from "@/components/ui/EditProjectModal"

interface Project {
  id: string
  title: string
  desc: string
  repolink: string
  livelink: string
  contributors: string[]
  techstack: string[]
  image: string
}

export default function ProjectListPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [addProject, setAddProject] = useState<Project | null>(null)
  const [editProject, setEditProject] = useState<Project | null>(null)
  const [search, setSearch] = useState("")

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get("/api/project/getProject")
        setProjects(res.data)
      } catch (error: any) {
        toast.error("Failed to fetch projects")
      }
    }
    fetchProjects()
  }, [])

  useEffect(() => {
    const isModalOpen = !!addProject || !!editProject
    document.body.style.overflow = isModalOpen ? "hidden" : "auto"
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [editProject, addProject])

  const handleAddProject = async (newProject: Project) => {
    setProjects((prev) => [...prev, newProject])
  }

  const handleEditProject = async (updatedProject: Project) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === updatedProject.id ? updatedProject : p)),
    )
  }

  const onDeleteProject = async (projectId: string) => {
    try {
      await axios.delete("/api/project/deleteProject", {
        data: { id: projectId },
      })
      toast.success("Project deleted successfully")
      setProjects((prev) => prev.filter((m) => m.id !== projectId))
    } catch (error: any) {
      console.log(error.message)
      toast.error("Failed to delete project")
    }
  }

  const Card: React.FC<{ project: Project }> = ({ project }) => {
    return (
      <div className="group flex flex-col overflow-hidden rounded-3xl border border-orange-200 bg-white shadow-xl ring-1 ring-orange-100 backdrop-blur-md transition-all duration-300 hover:scale-[1.02]">
        {project.image && (
          <div className="relative h-52 w-full">
            <Image
              src={project.image}
              alt={`${project.title} image`}
              fill
              className="object-cover"
            />
          </div>
        )}

        <div className="flex flex-col gap-3 px-6 py-5">
          <h3 className="line-clamp-2 text-lg font-bold text-orange-900">
            {project.title}
          </h3>
          <p className="line-clamp-3 text-sm text-gray-700">{project.desc}</p>
          <p className="text-xs text-blue-600">
            RepoLink:{" "}
            <a
              href={project.repolink}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Visit Repo
            </a>
          </p>
          {project.livelink && (
            <p className="text-xs text-green-600">
              LiveLink:{" "}
              <a
                href={project.livelink}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Visit Live
              </a>
            </p>
          )}
          <p className="text-xs text-gray-500">
            Contributors: {project.contributors.join(", ") || "N/A"}
          </p>
          <div className="flex flex-wrap gap-2 text-xs font-medium text-orange-600">
            {project.techstack.map((tech, idx) => (
              <span
                key={idx}
                className="rounded-full bg-orange-100 px-2 py-0.5"
              >
                #{tech}
              </span>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap justify-start gap-4">
            <button
              onClick={() => setEditProject(project)}
              className="rounded-full bg-blue-500 px-5 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-600"
            >
              Edit
            </button>
            <button
              onClick={() => onDeleteProject(project.id)}
              className="rounded-full bg-red-500 px-5 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-rose-100 px-6 py-12">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-10 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <button
            onClick={() =>
              setAddProject({
                id: "",
                title: "",
                desc: "",
                repolink: "",
                livelink: "",
                contributors: [],
                techstack: [],
                image: "",
              })
            }
            className="rounded-lg bg-orange-500 px-6 py-3 text-white shadow-md transition hover:bg-orange-600"
          >
            Add Project
          </button>

          <div className="w-full sm:w-1/2">
            <input
              type="text"
              name="search"
              placeholder="Search projects"
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {projects
            .filter((e) => e.title.toLowerCase().includes(search.toLowerCase()))
            .map((project: Project) => (
              <Card key={project.id} project={project} />
            ))}
        </div>

        {addProject && (
          <AddProjectModal
            project={addProject}
            onClose={() => setAddProject(null)}
            onAdd={handleAddProject}
          />
        )}

        {editProject && (
          <EditProjectModal
            project={editProject}
            onClose={() => setEditProject(null)}
            onEdit={handleEditProject}
          />
        )}
      </div>
    </div>
  )
}
