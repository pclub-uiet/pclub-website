"use client"
import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import axios from "axios"
import Image from "next/image"
import EditEventModal from "@/components/ui/EditEventModal"
import AddEventModal from "@/components/ui/AddEventModal"

type Status = "UPCOMING" | "COMPLETED" | "CANCELLED"

interface Event {
  id: string
  title: string
  desc: string
  eventType: string[]
  registerLink: string
  bannerImage: string
  status: Status
  organizer: string
  speaker: string
  recordLink: string
  date: string
  location: string
}

export default function EventPage() {
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>([])
  const [addEvent, setAddEvent] = useState<Event | null>(null)
  const [editEvent, setEditEvent] = useState<Event | null>(null)
  const [search, setSearch] = useState("")

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("/api/event/getEvent")
        setEvents(res.data)
      } catch (error: any) {
        toast.error("Failed to fetch events")
      }
    }
    fetchEvents()
  }, [])

  useEffect(() => {
    const isModalOpen = !!addEvent || !!editEvent

    if (isModalOpen) {
      // Disable scroll
      document.body.style.overflow = "hidden"
    } else {
      // Re-enable scroll
      document.body.style.overflow = "auto"
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [addEvent, editEvent])

  const onDeleteEvent = async (eventId: string) => {
    try {
      await axios.delete("/api/event/deleteEvent", {
        data: { id: eventId },
      })
      toast.success("Event deleted successfully")
      setEvents((prev) => prev.filter((m) => m.id !== eventId))
    } catch (error: any) {
      console.log(error.message)
      toast.error("Failed to delete event")
    }
  }

  const handleAddEvent = async (newEvent: Event) => {
    setEvents((prev) => [...prev, newEvent])
  }

  const handleEditEvent = async (updatedEvent: Event) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)),
    )
  }

  const formatCustomDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const day = date.getDate()
    const monthName = date.toLocaleString("en-US", { month: "long" })
    const year = date.getFullYear()

    const getDaySuffix = (d: number) => {
      if (d >= 11 && d <= 13) return "th"
      switch (d % 10) {
        case 1:
          return "st"
        case 2:
          return "nd"
        case 3:
          return "rd"
        default:
          return "th"
      }
    }

    return `${day}${getDaySuffix(day)} ${monthName}, ${year}`
  }

  const Card: React.FC<{ event: Event }> = ({ event }) => {
    const getStatusStyle = (status: Status) => {
      switch (status) {
        case "UPCOMING":
          return "bg-yellow-100 text-yellow-800"
        case "COMPLETED":
          return "bg-green-100 text-green-700"
        case "CANCELLED":
          return "bg-red-100 text-red-700"
        default:
          return "bg-yellow-100 text-yellow-800"
      }
    }

    return (
      <div className="group flex flex-col overflow-hidden rounded-3xl border border-orange-200 bg-white shadow-xl ring-1 ring-orange-100 backdrop-blur-md transition-all duration-300 hover:scale-[1.02]">
        {event.bannerImage && (
          <div className="relative h-48 w-full">
            <Image
              src={event.bannerImage}
              alt={`${event.title} image`}
              fill
              className="object-cover"
            />
          </div>
        )}

        <div className="flex flex-col gap-3 px-6 py-5 text-gray-800">
          <h3 className="text-xl font-bold text-orange-900">{event.title}</h3>
          <p className="line-clamp-3 text-sm text-gray-700">{event.desc}</p>

          <div className="flex flex-wrap gap-2 text-xs font-medium text-orange-600">
            {event.eventType.map((type, idx) => (
              <span
                key={idx}
                className="rounded-full bg-orange-100 px-2 py-0.5"
              >
                #{type}
              </span>
            ))}
          </div>

          <div className="mt-2 flex flex-col gap-1 text-xs font-medium text-gray-600">
            <div className="flex items-center gap-5">
              <p>{formatCustomDate(event.date)}</p>
              <span
                className={`rounded-full px-3 py-1 text-[11px] font-semibold ${getStatusStyle(event.status)}`}
              >
                {event.status}
              </span>
            </div>
            {event.registerLink && (
              <a
                href={event.registerLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                Register Here
              </a>
            )}
          </div>
        </div>

        <div className="flex gap-4 border-t border-orange-100 px-6 py-4">
          <button
            onClick={() => setEditEvent(event)}
            className="rounded-full bg-blue-500 px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-600"
          >
            Edit
          </button>
          <button
            onClick={() => onDeleteEvent(event.id)}
            className="rounded-full bg-red-500 px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf3ef] to-[#e7dbdc] px-6 py-16">
      <div className="mx-auto max-w-7xl">
        {/* Top Controls: Add + Search */}
        <div className="mb-10 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <button
            onClick={() =>
              setAddEvent({
                id: "",
                title: "",
                desc: "",
                eventType: [],
                registerLink: "",
                bannerImage: "",
                status: "UPCOMING",
                organizer: "",
                speaker: "",
                recordLink: "",
                date: "",
                location: "",
              })
            }
            className="rounded-lg bg-[#ec684a] px-6 py-3 text-white shadow-md transition hover:bg-[#d65732]"
          >
            Add Event
          </button>

          <div className="w-full sm:w-1/2">
            <input
              type="text"
              placeholder="Search by title"
              name="search"
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
        </div>

        {/* Event Cards Grid */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3">
          {events
            .filter((e) => e.title.toLowerCase().includes(search.toLowerCase()))
            .map((event: Event) => (
              <Card key={event.id} event={event} />
            ))}
        </div>

        {addEvent && (
          <AddEventModal
            event={addEvent}
            onClose={() => setAddEvent(null)}
            onAdd={handleAddEvent}
          />
        )}

        {editEvent && (
          <EditEventModal
            event={editEvent}
            onClose={() => setEditEvent(null)}
            onEdit={handleEditEvent}
          />
        )}
      </div>
    </div>
  )
}
