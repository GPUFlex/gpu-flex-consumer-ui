"use client"

import type React from "react"
import { useState } from "react"
import { useAtom } from "jotai"
import { userAtom, tasksAtom } from "@/lib/atoms"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, Loader2 } from "lucide-react"
import axios from 'axios'

const MODELS = ["ResNet", "GPT-2", "Custom-CNN", "BERT", "YOLOv8"]
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

export function TaskForm() {
  const [user] = useAtom(userAtom)
  const [tasks, setTasks] = useAtom(tasksAtom)
  const [taskName, setTaskName] = useState("")

  const [file, setFile] = useState<File | null>(null)
  const [modelFile, setModelFile] = useState<File | null>(null)
  //const [trainFuncFile, setTrainFuncFile] = useState<File | null>(null)

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  console.log(user);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (!selectedFile.name.endsWith(".csv")) {
        setError("Only csv files are allowed")
        setFile(null)
        return
      }
      setFile(selectedFile)
      setError("")
    }
  }

  const handleModelFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.name.endsWith(".py")) {
      setModelFile(selectedFile)
    }
  }

  // const handleTrainFuncFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const selectedFile = e.target.files?.[0]
  //   if (selectedFile && selectedFile.name.endsWith(".pkl")) {
  //     setTrainFuncFile(selectedFile)
  //   }
  // }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !file) return

    setError("")
    setSuccess("")
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("name", taskName)
      formData.append("consumerId", user.id)
      formData.append("dataset", file)

      if (modelFile) formData.append("modelFile", modelFile)
      //if (trainFuncFile) formData.append("trainFuncFile", trainFuncFile)

      const response = await axios.post(`${backendUrl}/api/tasks`, formData)
      const data = response.data

      setTasks((prev) => [data.task, ...prev])
      setTaskName("")
      setFile(null)
      setSuccess("Task submitted successfully!")
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "Failed to submit task")
      } else {
        setError("Failed to submit task")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit Training Job</CardTitle>
        <CardDescription>Upload your dataset and configure your GPU training job</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="taskName">Task Name</Label>
            <Input
              id="taskName"
              placeholder="Enter task name"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Dataset File (csv only)</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="file"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                disabled={isSubmitting}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <Upload className="h-4 w-4 text-gray-400" />
            </div>
            {file && (
              <p className="text-sm text-gray-600">
                Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}

            <div className="space-y-2">
              <Label htmlFor="modelFile">Model (.py)</Label>
              <Input
                id="modelFile"
                type="file"
                accept=".py"
                onChange={handleModelFileChange}
                disabled={isSubmitting}
              />
              {modelFile && <p className="text-sm text-gray-600">Model: {modelFile.name}</p>}
            </div>

            {/* <div className="space-y-2">
              <Label htmlFor="trainFuncFile">Optional Train Function (.pkl)</Label>
              <Input
                id="trainFuncFile"
                type="file"
                accept=".pkl"
                onChange={handleTrainFuncFileChange}
                disabled={isSubmitting}
              />
              {trainFuncFile && <p className="text-sm text-gray-600">Train function: {trainFuncFile.name}</p>}
            </div> */}

          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || !taskName || !modelFile || !file || !!error}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Task"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}