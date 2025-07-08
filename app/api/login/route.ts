import { type NextRequest, NextResponse } from "next/server"

const MOCK_USERS = [
  { id: "cmcoqa0xi0000stzyhctovd7d", email: "alice@example.com", password: "alice123", name: "Alice Johnson" },
  { id: "cmcoqa0xq0001stzy74wwv483", email: "bob@example.com", password: "bob123", name: "Bob Smith" },
]

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const user = MOCK_USERS.find((u) => u.email === email && u.password === password)

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const { password: _, ...userWithoutPassword } = user
    return NextResponse.json({ user: userWithoutPassword })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
