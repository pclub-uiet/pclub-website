"use client"
import { useRouter } from "next/navigation"
import { useTransition } from "react"

export default function DeleteProjectButton({ id }: { id: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleDelete = async () => {
    const confirmed = confirm("Are you sure you want to delete this project?")
    if (!confirmed) return

    try {
      const res = await fetch(`/api/project/${id}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        throw new Error("Failed to delete project")
      }

      startTransition(() => {
        router.refresh()
      })
    } catch (err: any) {
      alert("Error deleting project")
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  )
}
