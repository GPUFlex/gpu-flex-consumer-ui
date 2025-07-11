"use client"

import { useRouter } from "next/navigation"
import { useAtom } from "jotai"
import { userAtom, isAuthenticatedAtom } from "@/lib/atoms"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LogOut, Zap } from "lucide-react"

export function Navbar() {
  const [user, setUser] = useAtom(userAtom)
  const [isAuthenticated] = useAtom(isAuthenticatedAtom)
  const router = useRouter()

  const handleLogout = () => {
    setUser(null)
    router.push("/login")
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
  }

  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Zap className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">GPU Flex</span>
          </div>

          {isAuthenticated && user && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-blue-100 text-blue-700">{getInitials(user.username)}</AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{user.username}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-transparent"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
