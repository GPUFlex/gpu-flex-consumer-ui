"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAtom } from "jotai"
import { isAuthenticatedAtom } from "@/lib/atoms"
import { Loader2 } from "lucide-react"

export default function HomePage() {
  const [isAuthenticated] = useAtom(isAuthenticatedAtom)
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard")
    } else {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  )
}
