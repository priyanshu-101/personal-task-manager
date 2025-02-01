"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getProjects, deleteProject } from "@/api/project";
import Spinner from "@/components/spinner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Dashboard() {
  const [greeting, setGreeting] = useState("Good morning");
  const [deleteProjectModal, setDeleteProject] = useState(null); 
  const router = useRouter();

  const storedUser = JSON.parse(localStorage.getItem("user") || "null");

  const { data: projects = [], isLoading, error, refetch } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const deleteMutation = useMutation({
    mutationFn: (projectId) => deleteProject(projectId),
    onSuccess: () => {
      refetch();
    },
    onError: (error) => {
      console.error("Error deleting project:", error);
    },
  });

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 12 && hour < 18) setGreeting("Good afternoon");
    else if (hour >= 18) setGreeting("Good evening");
  }, []);

  const handleDelete = (projectId) => {
    deleteMutation.mutate(projectId); 
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">
            {greeting}, {storedUser?.name} 👋
          </h1>
          <p className="text-gray-600">Here's an overview of your projects.</p>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Your Projects</h2>
          <Button
            variant="default"
            className="flex items-center gap-2"
            onClick={() => router.push("/project")}
          >
            <PlusCircle className="h-5 w-5" />
            Create Project
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Spinner />
          </div>
        ) : error ? (
          <p className="text-red-500">Error loading projects.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card
                key={project.id}
                className="shadow-md hover:shadow-lg transition cursor-pointer relative"
              >
                <CardHeader className="p-4">
                  <div className="flex items-center justify-between space-x-2">
                    <CardTitle className="truncate">{project.name}</CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => console.log("Update", project.id)}>
                          Update
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDeleteProject(project)}>
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{project.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <AlertDialog open={!!deleteProjectModal} onOpenChange={() => setDeleteProject(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to delete this project?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete "{deleteProjectModal?.name}" and all of its contents. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleDelete(deleteProjectModal?.id)} 
                className="bg-red-500 hover:bg-red-600"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
}
