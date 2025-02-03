"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle, AlertTriangle } from "lucide-react";
import { gettasks } from "@/api/task";
import { format } from "date-fns";

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
      const tasks = await gettasks();

      const today = new Date();
      today.setHours(0, 0, 0, 0); 
      
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      const dayAfterTomorrow = new Date(today);
      dayAfterTomorrow.setDate(today.getDate() + 2);

      const filteredUpcomingTasks = tasks.filter((task) => {
        const taskDueDate = new Date(task.dueDate);
        taskDueDate.setHours(0, 0, 0, 0); 
        
        return (
          task.status?.toLowerCase() !== "completed" &&
          (taskDueDate.toDateString() === tomorrow.toDateString() ||
            taskDueDate.toDateString() === dayAfterTomorrow.toDateString() ||
            taskDueDate.toDateString() === today.toDateString()) 
        );
      });

      const filteredCompletedTasks = tasks.filter((task) => 
        task.status?.toLowerCase() === "completed"
      );

      const filteredExpiredTasks = tasks.filter((task) => {
        const taskDueDate = new Date(task.dueDate);
        taskDueDate.setHours(0, 0, 0, 0); 
        return taskDueDate < today && task.status?.toLowerCase() !== "completed";
      });

      setUpcomingTasks(filteredUpcomingTasks);
      setCompletedTasks(filteredCompletedTasks);
      setExpiredTasks(filteredExpiredTasks);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };

  useEffect(() => {
    fetchtasks();
  }, []);

  const getPriorityColor = (priority: any) => {
    if (!priority || typeof priority !== "string") return "text-gray-600";
  
    const colors: { [key: string]: string } = {
      high: "text-red-600",
      medium: "text-yellow-600",
      low: "text-green-600"
    };
  
    return colors[priority.toLowerCase()] || "text-gray-600";
  };
  
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Calendar className="w-6 h-6" />
          Upcoming Tasks
        </h2>
        {upcomingTasks.length === 0 ? (
          <Card className="bg-gray-50 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-gray-600 text-lg">No upcoming tasks for today or next two days</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingTasks.map((task) => (
              <Card key={task.id} className="shadow-md hover:shadow-lg transition-shadow">
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
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {completedTasks.length > 0 ? (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <CheckCircle className="w-6 h-6" />
            Completed Tasks
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedTasks.map((task) => (
              <Card key={task.id} className="shadow-md bg-gray-50">
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
                    <Badge variant="success">Completed</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            Completed Tasks
          </h2>
          <Card className="bg-gray-50 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-gray-600 text-lg">No task completed yet</p>
            </CardContent>
          </Card>
        </div>
      )}

      {expiredTasks.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-6 h-6" />
            Expired Tasks
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {expiredTasks.map((task) => (
              <Card key={task.id} className="shadow-md bg-red-50">
                <CardHeader>
                  <CardTitle className="text-lg">{task.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <p className="text-gray-600 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(task.dueDate), "dd MMM yyyy")}
                  </p>
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