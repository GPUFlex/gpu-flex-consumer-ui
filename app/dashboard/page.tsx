"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAtom } from "jotai"
import { isAuthenticatedAtom } from "@/lib/atoms"
import { TaskForm } from "@/components/task-form"
import { TaskList } from "@/components/task-list"

export default function DashboardPage() {
  const [isAuthenticated] = useAtom(isAuthenticatedAtom)
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TaskForm />
        <div className="lg:col-span-1">
          <TaskList />
        </div>
      </div>
    </div>
  )
}
