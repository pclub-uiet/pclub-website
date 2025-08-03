import axios from "axios"
import { NextResponse } from "next/server"
import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark } from "@fortawesome/free-solid-svg-icons"
import toast from "react-hot-toast"

enum Status {
  UPCOMING = "UPCOMING",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
}

export default function EditEventModal({ event, onClose, onEdit }: any) {
  const [load, setLoad] = React.useState(false)

  const [formData, setFormData] = React.useState({
    title: event.title,
    desc: event.desc,
    eventType: event.eventType,
    status: event.status,
    speaker: event.speaker,
    date: event.date,
    location: event.location,
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const onUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault()

    if (
      formData.title.trim().length === 0 ||
      formData.desc.trim().length === 0 ||
      formData.eventType.length === 0 ||
      formData.status.trim().length === 0 ||
      formData.date.trim().length === 0
    ) {
      toast.error("Please fill in all fields")
      return
    }

    try {
      setLoad(true)
      const updatedEvent = await axios.put("/api/event/updateEvent", {
        id: event.id,
        ...formData,
      })

      toast.success("Event updated!")
      onEdit({
        ...event,
        ...formData,
      })
      onClose() // close modal after success
    } catch (error: any) {
      toast.error("Failed to update event")
      console.error("Edit Event Error:", error)
    } finally {
      setLoad(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-orange-300 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-orange-200 bg-orange-50 px-8 py-5">
          <h2 className="text-2xl font-bold text-orange-800">Edit Event</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-gray-600 hover:text-red-500"
          >
            <FontAwesomeIcon icon={faXmark} size="lg" />
          </button>
        </div>

        <div className="max-h-[calc(90vh-70px)] overflow-y-auto px-8 py-6">
          <form onSubmit={onUpdateEvent} className="space-y-4">
            <input
              type="text"
              placeholder="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full rounded-md border border-orange-600 px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="text"
              placeholder="Description"
              name="desc"
              value={formData.desc}
              onChange={handleChange}
              className="w-full rounded-md border border-orange-600 px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="text"
              placeholder="Event Type (comma separated)"
              name="eventType"
              value={formData.eventType.join(", ")}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  eventType: e.target.value.split(",").map((s) => s.trim()),
                }))
              }
              className="w-full rounded-md border border-orange-600 px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="relative">
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full appearance-none rounded-md border border-orange-600 px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.values(Status).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 top-1/2 -translate-y-1/2 text-gray-500">
                ▼
              </div>
            </div>

            <input
              type="text"
              placeholder="Speaker"
              name="speaker"
              value={formData.speaker}
              onChange={handleChange}
              className="w-full rounded-md border border-orange-600 px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="date"
              placeholder="Date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full rounded-md border border-orange-600 px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="text"
              placeholder="Location (e.g.- UIET, PU)"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full rounded-md border border-orange-600 px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
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
