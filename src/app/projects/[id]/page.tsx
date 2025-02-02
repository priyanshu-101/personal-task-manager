"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Sidebar from "@/components/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { gettasks } from "@/api/task";
import Spinner from "@/components/spinner";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { FaEllipsisV } from "react-icons/fa"; 
import { deletetask } from "@/api/task";
   

const COLORS = ["#4CAF50", "#FF9800", "#F44336"]; // Green, Orange, Red

export default function ProjectTasks() {
  const { id } = useParams();
  const [projectTasks, setProjectTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [taskStats, setTaskStats] = useState([]);
  const [menuOpen, setMenuOpen] = useState(null); // State to track which task has the menu open

  const fetchtasks = async () => {
    setIsLoading(true);
    try {
      const tasks = await gettasks();

      if (!Array.isArray(tasks)) {
        throw new Error("Invalid tasks response format");
      }

      // Filter tasks for the selected project
      const filteredTasks = tasks
        .filter((task) => task.projectId === Number(id))
        .map((task) => ({
          id: task.id,
          title: task.title,
          dueDate: new Date(task.dueDate).toLocaleDateString("en-GB", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
          status: task.status.charAt(0).toUpperCase() + task.status.slice(1), 
        }));

      // Sort by due date
      filteredTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

      setProjectTasks(filteredTasks);
      calculateTaskStats(filteredTasks);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTaskStats = (tasks) => {
    const statusCounts = tasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {});

    const chartData = Object.keys(statusCounts).map((status) => ({
      name: status,
      value: statusCounts[status],
    }));

    setTaskStats(chartData);
  };

  const handleMenuToggle = (taskId) => {
    setMenuOpen(menuOpen === taskId ? null : taskId); // Toggle the menu
  };

  const handleUpdate = (taskId) => {
    // Handle task update
    console.log("Update task:", taskId);
  };

  const handleDelete  = async (taskId) => {
    try {
      setIsLoading(true);
      const response = await deletetask(taskId);
      fetchtasks();
    } catch (error) {
      console.error("Failed to delete task:", error);
    }finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchtasks();
  }, [id]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Project Tasks</h1>

        {isLoading ? (
          <div className="flex justify-center items-center">
            <Spinner />
          </div>
        ) : (
          <>
            {taskStats.length > 0 && (
              <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                <h2 className="text-xl font-semibold text-center mb-4">Task Status Overview</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={taskStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {taskStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {projectTasks.length === 0 ? (
              <p className="text-gray-500">No tasks available for this project.</p>
            ) : (
              <div className="grid gap-4">
                {projectTasks.map((task) => (
                  <Card key={task.id} className="shadow-md relative">
                    <CardHeader className="flex">
                      <CardTitle>{task.title}</CardTitle>
                      <button
                        onClick={() => handleMenuToggle(task.id)}
                        className="text-gray-600 hover:text-gray-800 absolute top-2 right-2"
                      >
                        <FaEllipsisV />
                      </button>
                    </CardHeader>
                    {menuOpen === task.id && (
                      <div className="absolute top-12 right-2 bg-white shadow-md rounded-lg w-40 py-2 z-10">
                        <button
                          onClick={() => handleUpdate(task.id)}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleDelete(task.id)}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-200"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                    <CardContent className="flex justify-between items-center">
                      <p className="text-gray-600">Due: {task.dueDate}</p>
                      <Badge
                        variant={task.status.toLowerCase() === "completed" ? "success" : "default"}
                      >
                        {task.status}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
