"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle, AlertTriangle, PlusCircle } from "lucide-react";
import { gettasks } from "@/api/task";
import { format } from "date-fns";
import Link from "next/link";

interface Task {
  id: number;
  title: string;
  dueDate: string;
  priority: string;
  status: string;
}

export default function UpcomingTasks() {
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [expiredTasks, setExpiredTasks] = useState<Task[]>([]);

  const fetchtasks = async () => {
    try {
      const tasksResponse = await gettasks();
      const tasks = Array.isArray(tasksResponse) ? tasksResponse : [];

      if (tasks.length === 0) {
        return;
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const filteredUpcomingTasks = tasks.filter((task) => {
        const taskDueDate = new Date(task.dueDate);
        taskDueDate.setHours(0, 0, 0, 0);
        return task.status?.toLowerCase() !== "completed" && taskDueDate >= today;
      });

      setUpcomingTasks(filteredUpcomingTasks);
      setCompletedTasks(tasks.filter((task) => task.status?.toLowerCase() === "completed"));
      setExpiredTasks(tasks.filter((task) => {
        const taskDueDate = new Date(task.dueDate);
        taskDueDate.setHours(0, 0, 0, 0);
        return taskDueDate < today && task.status?.toLowerCase() !== "completed";
      }));
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };

  useEffect(() => {
    fetchtasks();
  }, []);

  const getPriorityColor = (priority: string | null | undefined) => {
    if (!priority || typeof priority !== "string") return "text-gray-600";
    const colors: Record<string, string> = {
      high: "text-red-600",
      medium: "text-yellow-600",
      low: "text-green-600",
    };
    return colors[priority.toLowerCase()] || "text-gray-600";
  };

  const generateGoogleCalendarUrl = (task: Task) => {
    const startDate = format(new Date(task.dueDate), "yyyyMMdd");
    const eventUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      task.title
    )}&dates=${startDate}/${startDate}&details=${encodeURIComponent("Task from Task Manager")}`;
    return eventUrl;
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Calendar className="w-6 h-6" /> Upcoming Tasks
        </h2>
        {upcomingTasks.length === 0 ? (
          <Card className="bg-gray-50 border-dashed">
            <CardContent className="text-center py-8">
              <p className="text-gray-600 text-lg">No upcoming tasks</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingTasks.map((task) => (
              <Card key={task.id} className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">{task.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <p className="text-gray-600 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(task.dueDate), "dd MMM yyyy")}
                  </p>
                  <div className="flex justify-between items-center">
                    <p className={`font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority || 'No'} Priority
                    </p>
                    <Badge variant="outline">{task.status}</Badge>
                  </div>
                  <Link href={generateGoogleCalendarUrl(task)} target="_blank">
                    <div className="flex items-center gap-2 text-blue-600 hover:text-blue-800 cursor-pointer">
                      <PlusCircle className="w-5 h-5" />
                      <span>Add to Google Calendar</span>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <CheckCircle className="w-6 h-6" /> Completed Tasks
        </h2>
        {completedTasks.length === 0 ? (
          <Card className="bg-gray-50 border-dashed">
            <CardContent className="text-center py-8">
              <p className="text-gray-600 text-lg">No completed tasks</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedTasks.map((task) => (
              <Card key={task.id} className="shadow-md bg-gray-50">
                <CardHeader>
                  <CardTitle className="text-lg">{task.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{format(new Date(task.dueDate), "dd MMM yyyy")}</p>
                  <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">Completed</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {expiredTasks.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-6 h-6" /> Expired Tasks
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {expiredTasks.map((task) => (
              <Card key={task.id} className="shadow-md bg-red-50">
                <CardHeader>
                  <CardTitle className="text-lg">{task.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{format(new Date(task.dueDate), "dd MMM yyyy")}</p>
                  <Badge variant="destructive">Expired</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
