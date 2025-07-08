import { atom } from "jotai"

export interface User {
  id: string
  email: string
  name: string
}

export interface Task {
  id: string
  name: string
  model: string
  status: "QUEUED" | "RUNNING" | "COMPLETED" | "FAILED"
  consumerId: string
  fileName?: string
  createdAt: string
  updatedAt: string
}

// Auth atoms
export const userAtom = atom<User | null>(null)
export const isAuthenticatedAtom = atom((get) => get(userAtom) !== null)

// Task atoms
export const tasksAtom = atom<Task[]>([])
export const isLoadingTasksAtom = atom(false)
