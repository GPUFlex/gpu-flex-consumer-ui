"use client"

import { useEffect } from "react"
import { useAtom } from "jotai"
import { userAtom, tasksAtom, isLoadingTasksAtom } from "@/lib/atoms"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw, FileText, Cpu, Calendar } from "lucide-react"
import axios from "axios"

const STATUS_COLORS = {
  QUEUED: "bg-yellow-100 text-yellow-800 border-yellow-200",
  RUNNING: "bg-blue-100 text-blue-800 border-blue-200",
  COMPLETED: "bg-green-100 text-green-800 border-green-200",
  FAILED: "bg-red-100 text-red-800 border-red-200",
}
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

export function TaskList() {
  const [user] = useAtom(userAtom)
  const [tasks, setTasks] = useAtom(tasksAtom)
  const [isLoading, setIsLoading] = useAtom(isLoadingTasksAtom)

  const fetchTasks = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const response = await axios.get(
        `${backendUrl}/api/tasks`,
        { params: { consumerId: user.id } },   // nicer Axios way
      );
      console.log(response.data);
      setTasks(response.data);                 // <-- Axios puts payload in .data
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchTasks()
  }, [user])

  // Polling every 10 seconds
  // useEffect(() => {
  //   const interval = setInterval(fetchTasks, 10000)
  //   return () => clearInterval(interval)
  // }, [user])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Your Training Jobs</CardTitle>
          <CardDescription>Monitor the status of your submitted tasks</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={fetchTasks} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Cpu className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No training jobs submitted yet</p>
            <p className="text-sm">Submit your first task above to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.filter(task => task).map((task) => (
              <div key={task.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-lg">{task.name}</h3>
                      <Badge className={STATUS_COLORS[task.status]}>{task.status}</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Cpu className="h-4 w-4" />
                        <span>Model: {task.model}</span>
                      </div>

                      {task.trainedModel && (
                        <a
                          href={`${backendUrl}/api/tasks/${task.id}/model`}
                          download={`${task.name}.pth`}
                          className="text-sm text-blue-600 hover:underline ml-4"
                        >
                          Download trained model
                        </a>
                      )}

                      {task.fileName && (
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4" />
                          <span>File: {task.fileName}</span>
                        </div>
                      )}

                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>Created: {formatDate(task.createdAt)}</span>
                      </div>
                    </div>

                    {task.updatedAt !== task.createdAt && (
                      <div className="mt-2 text-xs text-gray-500">Last updated: {formatDate(task.updatedAt)}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
