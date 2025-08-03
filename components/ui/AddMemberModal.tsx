import axios from "axios"
import { NextResponse } from "next/server"
import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark, faPlus, faMinus } from "@fortawesome/free-solid-svg-icons"
import toast from "react-hot-toast"

export default function AddMemberModal({ member, onClose, onAdd }: any) {
  const [load, setLoad] = React.useState(false)

  const [formData, setFormData] = React.useState({
    name: member.email,
    roll_no: member.roll_no,
    email: member.email,
    branch: member.branch,
    year: member.year,
    role: member.role,
    profile_picture: member.profile_picture,
    socials: member.socials,
  })

  const [socials, setSocials] = React.useState([{ name: "", url: "" }])

  const addSocial = () => {
    if (socials.length < 3) {
      setSocials([...socials, { name: "", url: "" }])
    } else {
      toast.custom("You can only add up to 3 social links.")
    }
  }

  const removeSocial = (index: number) => {
    const newSocials = socials.filter((_, i) => i !== index)
    setSocials(newSocials)
  }

  const handleSocialChange = (
    index: number,
    field: "name" | "url",
    value: string,
  ) => {
    const newSocial = [...socials]
    newSocial[index][field] = value
    setSocials(newSocial)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "year" ? Number(value) : value,
    }))
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const socialJson: Record<string, string> = {}
    socials.forEach(({ name, url }) => {
      if (name && url) socialJson[name] = url
    })

    if (
      formData.name.trim().length === 0 ||
      formData.roll_no.trim().length === 0 ||
      formData.email.trim().length === 0 ||
      formData.branch.trim().length === 0 ||
      formData.year === 0 ||
      Object.keys(socialJson).length === 0
    ) {
      toast.error("Please fill in all fields")
      return
    }

    try {
      setLoad(true)
      const { name, email, roll_no, branch, year, role, profile_picture } =
        formData
      const newMember = {
        name,
        email,
        roll_no,
        branch,
        year,
        role,
        profile_picture,
        socials: socialJson,
      }

      const res = await axios.post("/api/member/addMember", newMember)
      const savedMember = res.data
      onAdd(savedMember)
      toast.success("Member added!")
      onClose()
    } catch (error: any) {
      toast.error("Failed to add member")
      console.error(error)
    } finally {
      setLoad(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-orange-300 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-orange-200 bg-orange-50 px-8 py-5">
          <h2 className="text-2xl font-bold text-orange-800">Add Member</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-gray-600 hover:text-red-500"
          >
            <FontAwesomeIcon icon={faXmark} size="lg" />
          </button>
        </div>

        <div className="max-h-[calc(90vh-70px)] overflow-y-auto px-8 py-6">
          <form onSubmit={onSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-md border border-orange-600 px-4 py-3 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="text"
              placeholder="Roll Number"
              name="roll_no"
              value={formData.roll_no}
              onChange={handleChange}
              className="w-full rounded-md border border-orange-600 px-4 py-3 text-black placeholder-gray-400"
            />

            <input
              type="email"
              placeholder="abc@gmail.com"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-md border border-orange-600 px-4 py-3 text-black placeholder-gray-400"
            />

            {/* Branch and Year side-by-side */}
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Branch"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                className="w-1/2 rounded-md border border-orange-600 px-4 py-3 text-black placeholder-gray-400"
              />
              <input
                type="number"
                placeholder="Year"
                name="year"
                min={1}
                max={4}
                value={formData.year}
                onChange={handleChange}
                className="w-1/2 rounded-md border border-orange-600 px-4 py-3 text-black placeholder-gray-400"
              />
            </div>

            <input
              type="text"
              placeholder="President, Core, Member, Team Lead"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full rounded-md border border-orange-600 px-4 py-3 text-black placeholder-gray-400"
            />

            <input
              type="text"
              placeholder="Image URL"
              name="profile_picture"
              value={formData.profile_picture}
              onChange={handleChange}
              className="w-full rounded-md border border-orange-600 px-4 py-3 text-black placeholder-gray-400"
            />

            {/* Socials section */}
            <div className="mb-2 flex items-center justify-between">
              <label className="font-medium text-gray-800">Socials</label>
              <button
                type="button"
                onClick={addSocial}
                aria-label="Add Social"
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-500"
              >
                <FontAwesomeIcon icon={faPlus} /> Add Social
              </button>
            </div>

            {socials.map((social, index) => (
              <div key={index} className="mb-2 flex items-center gap-4">
                <input
                  type="text"
                  placeholder="Platform (e.g. Github)"
                  value={social.name}
                  onChange={(e) =>
                    handleSocialChange(index, "name", e.target.value)
                  }
                  className="w-1/2 rounded-md border border-orange-600 px-4 py-2 text-black placeholder-gray-400"
                />
                <input
                  type="url"
                  placeholder="Link"
                  value={social.url}
                  onChange={(e) =>
                    handleSocialChange(index, "url", e.target.value)
                  }
                  className="w-1/2 rounded-md border border-orange-600 px-4 py-2 text-black placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() => removeSocial(index)}
                  className="text-sm text-red-500 hover:text-red-600"
                >
                  <FontAwesomeIcon icon={faMinus} />
                </button>
              </div>
            ))}

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
