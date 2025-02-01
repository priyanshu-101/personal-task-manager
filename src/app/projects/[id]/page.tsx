"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Sidebar from "@/components/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const tasks = [
  { id: 1, projectId: 1, title: "Setup Next.js", dueDate: "2025-02-05", status: "To Do" },
  { id: 2, projectId: 1, title: "Design UI", dueDate: "2025-02-02", status: "In Progress" },
  { id: 3, projectId: 2, title: "Backend Setup", dueDate: "2025-02-10", status: "Completed" },
  { id: 4, projectId: 1, title: "Integrate Auth", dueDate: "2025-02-07", status: "To Do" },
];

export default function ProjectTasks() {
  const { id } = useParams();
  const [projectTasks, setProjectTasks] = useState([]);

  useEffect(() => {
    const filteredTasks = tasks.filter((task) => task.projectId === Number(id));
    filteredTasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    setProjectTasks(filteredTasks);
  }, [id]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Project Tasks</h1>

        {projectTasks.length === 0 ? (
          <p className="text-gray-500">No tasks available for this project.</p>
        ) : (
          <div className="grid gap-4">
            {projectTasks.map((task) => (
              <Card key={task.id} className="shadow-md">
                <CardHeader>
                  <CardTitle>{task.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-between items-center">
                  <p className="text-gray-600">Due: {task.dueDate}</p>
                  <Badge variant={task.status === "Completed" ? "success" : "default"}>
                    {task.status}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
