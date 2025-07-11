"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAtom } from "jotai"
import { userAtom } from "@/lib/atoms"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
  const [, setUser] = useAtom(userAtom)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [walletAddress, setWalletAddress] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const endpoint = isRegistering ? "http://localhost:8000/api/auth/register" : "http://localhost:8000/api/auth/login"
      const body = isRegistering
        ? { email, password, username, walletAddress }
        : { email, password }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || (isRegistering ? "Registration failed" : "Login failed"))
      }

      setUser(data.user)
      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : (isRegistering ? "Registration failed" : "Login failed"))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">GPU Flex</CardTitle>
          <CardDescription className="text-center">
            {isRegistering ? "Create a new account" : "Sign in to submit your training jobs"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            {isRegistering && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="walletAddress">Wallet Address</Label>
                  <Input
                    id="walletAddress"
                    type="text"
                    placeholder="Enter your wallet address"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isRegistering ? "Registering..." : "Signing in..."}
                </>
              ) : (
                isRegistering ? "Register" : "Sign In"
              )}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <Button variant="link" onClick={() => setIsRegistering(!isRegistering)}>
              {isRegistering ? "Already have an account? Sign in" : "Don't have an account? Register"}
            </Button>
          </div>
          {!isRegistering && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">Demo Credentials:</p>
              <div className="text-xs text-gray-600 space-y-1">
                <div>alice@example.com / alicepass</div>
                <div>bob@example.com / bobpass</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}