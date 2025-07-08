import { type NextRequest, NextResponse } from "next/server"

// Mock task storage (in a real app, this would be a database)
let mockTasks: Array<{
  id: string
  name: string
  model: string
  status: "QUEUED" | "RUNNING" | "COMPLETED" | "FAILED"
  consumerId: string
  fileName?: string
  createdAt: string
  updatedAt: string
}> = []

const MODELS = ["ResNet", "GPT-2", "Custom-CNN", "BERT", "YOLOv8"]

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const consumerId = url.searchParams.get("consumerId")

  if (!consumerId) {
    return NextResponse.json({ error: "Consumer ID required" }, { status: 400 })
  }

  // Simulate random status updates for existing tasks
  mockTasks = mockTasks.map((task) => {
    if (task.status === "QUEUED" && Math.random() > 0.7) {
      return { ...task, status: "RUNNING" as const, updatedAt: new Date().toISOString() }
    }
    if (task.status === "RUNNING" && Math.random() > 0.8) {
      const newStatus = Math.random() > 0.2 ? "COMPLETED" : "FAILED"
      return { ...task, status: newStatus as const, updatedAt: new Date().toISOString() }
    }
    return task
  })

  const userTasks = mockTasks.filter((task) => task.consumerId === consumerId)

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  return NextResponse.json({ tasks: userTasks })
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const name = formData.get("name") as string
    const model = formData.get("model") as string
    const consumerId = formData.get("consumerId") as string
    const file = formData.get("file") as File

    if (!name || !model || !consumerId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!MODELS.includes(model)) {
      return NextResponse.json({ error: "Invalid model selection" }, { status: 400 })
    }

    if (file && !file.name.endsWith(".zip")) {
      return NextResponse.json({ error: "Only ZIP files are allowed" }, { status: 400 })
    }

    // Simulate file processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newTask = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      model,
      status: "QUEUED" as const,
      consumerId,
      fileName: file?.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    mockTasks.push(newTask)

    return NextResponse.json({ task: newTask }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 })
  }
}
