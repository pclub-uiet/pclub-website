"use client"
import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import axios from "axios"
import { NextResponse, NextRequest } from "next/server"
import Image from "next/image"
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons"
import EditMemberModal from "@/components/ui/EditMemberModal"
import AddMemberModal from "@/components/ui/AddMemberModal"

type Member = {
  id: string
  name: string
  email: string
  roll_no: string
  role: string
  branch: string
  year: number
  socials: Record<string, string>
  profile_picture: string
}

export default function MemberPage() {
  const router = useRouter()
  const [members, setMembers] = useState<Member[]>([])
  const [editMember, setEditMember] = React.useState<Member | null>(null)
  const [addMember, setAddMember] = React.useState<Member | null>(null)
  const [search, setSearch] = React.useState("")

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const allData = await axios.get("/api/member/getMember")
        setMembers(allData.data)
      } catch (error: any) {
        toast.error("Failed to fetch members")
      }
    }
    fetchMembers()
  }, [])

  useEffect(() => {
    const isModalOpen = !!addMember || !!editMember
    document.body.style.overflow = isModalOpen ? "hidden" : "auto"
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [addMember, editMember])

  const onDeleteMember = async (memberID: string) => {
    try {
      await axios.delete("/api/member/deleteMember", {
        data: { id: memberID },
      })
      toast.success("Member deleted successfully")
      setMembers((prev) => prev.filter((m) => m.id !== memberID))
    } catch (error: any) {
      console.log(error.message)
      toast.error("Failed to delete member")
    }
  }

  const handleAddMember = async (newMember: Member) => {
    setMembers((prev) => [...prev, newMember])
  }

  const handleEditMember = async (updatedMember: Member) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === updatedMember.id ? updatedMember : m)),
    )
  }

  const Card: React.FC<{ member: Member }> = ({ member }) => {
    return (
      <div className="group flex flex-col overflow-hidden rounded-3xl border border-orange-200 bg-white shadow-xl ring-1 ring-orange-100 backdrop-blur-md transition-all duration-300 hover:scale-[1.02]">
        <div className="flex flex-col items-center px-6 py-8 text-center">
          {member.profile_picture && (
            <Image
              src={member.profile_picture}
              alt={`${member.name}'s profile`}
              width={100}
              height={100}
              className="h-24 w-24 rounded-full border-2 border-orange-500 object-cover shadow-md"
            />
          )}
          <div className="space-y-1 text-sm text-gray-700">
            <p className="text-lg font-semibold text-orange-900">
              {member.name}
            </p>
            <p>{member.roll_no}</p>
            <p>{member.email}</p>
            <p>
              {member.branch} - Year {member.year}
            </p>
          </div>
          <div className="mt-4 flex gap-5 text-xl">
            {member.socials.linkedin && (
              <a
                href={member.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0A66C2] hover:opacity-80"
              >
                <FontAwesomeIcon icon={faLinkedin} />
              </a>
            )}
            {member.socials.github && (
              <a
                href={member.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:opacity-80"
              >
                <FontAwesomeIcon icon={faGithub} />
              </a>
            )}
          </div>
        </div>

        <div className="flex justify-center gap-4 border-t border-orange-100 px-6 pb-4">
          <button
            className="rounded-full bg-blue-500 px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-600"
            onClick={() => setEditMember(member)}
          >
            Edit
          </button>
          <button
            className="rounded-full bg-red-500 px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-600"
            onClick={() => onDeleteMember(member.id)}
          >
            Delete
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-rose-100 px-6 py-16 text-gray-900">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-10 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <button
            className="rounded-lg bg-orange-500 px-6 py-3 text-white shadow-md transition hover:bg-orange-600"
            onClick={() =>
              setAddMember({
                id: "",
                name: "",
                email: "",
                roll_no: "",
                role: "",
                branch: "",
                year: 1,
                socials: {},
                profile_picture: "",
              })
            }
          >
            Add Member
          </button>

          <div className="w-full sm:w-1/2">
            <input
              type="text"
              placeholder="Search by name"
              name="search"
              className="w-full rounded-md border border-gray-300 px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
          {members
            .filter((m) => m.name.toLowerCase().includes(search.toLowerCase()))
            .map((member: Member) => (
              <Card key={member.id} member={member} />
            ))}
        </div>

        {editMember && (
          <EditMemberModal
            member={editMember}
            onClose={() => setEditMember(null)}
            onEdit={handleEditMember}
          />
        )}

        {addMember && (
          <AddMemberModal
            member={addMember}
            onClose={() => setAddMember(null)}
            onAdd={handleAddMember}
          />
        )}
      </div>
    </div>
  )
}
