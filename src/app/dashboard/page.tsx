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
import UpcomingTasks from "@/components/upcomingTasks";
import Footer from "@/components/Footer";
import UpdateProjectModal from "@/components/modal";
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

interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export default function Dashboard() {
  const [greeting, setGreeting] = useState("Good morning");
  const [deleteProjectModal, setDeleteProject] = useState<Project | null>(null);
  const [updateProjectData, setUpdateProjectData] = useState<Project | null>(null);
  const router = useRouter();

  const storedUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem("user") || "null") : null;

  const { data: projects = [], isLoading, error, refetch } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
    select: (data) => Array.isArray(data) ? data : [],
  });

  const deleteMutation = useMutation({
    mutationFn: (projectId: string) => deleteProject(projectId),
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

  const handleDelete = (projectId: string) => {
    deleteMutation.mutate(projectId);
    setDeleteProject(null);
  };

  return (
    <div className="relative flex min-h-screen bg-gray-100">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
          <Spinner />
        </div>
      )}
      <Sidebar />
  
      <main className="flex-1 p-8 pl-20"> 
        <div className="mb-6">
          <h1 className="text-3xl font-bold">
            {greeting}, {storedUser?.name} 👋
          </h1>
          <p className="text-gray-600">Here is an overview of your projects.</p>
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
  
        {error ? (
          <p className="text-red-500">Error loading projects.</p>
        ) : projects.length === 0 ? (
          <p className="text-gray-600">No projects found. Create your first project!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card
                key={project.id}
                className="shadow-md hover:shadow-lg transition cursor-pointer relative"
                onClick={() => router.push(`/projects/${project.id}`)}
              >
                <CardHeader className="p-4">
                  <div className="flex items-center justify-between space-x-2">
                    <CardTitle className="truncate">{project.name}</CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          setUpdateProjectData(project);
                        }}>
                          Update
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          setDeleteProject(project);
                        }}>
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
  
        <div className="mt-8">
          <UpcomingTasks />
        </div>
  
        <div className="mt-8">
          <Footer />
        </div>
  
        <UpdateProjectModal
          project={updateProjectData}
          isOpen={!!updateProjectData}
          onClose={() => setUpdateProjectData(null)}
          onSuccess={() => {
            refetch();
            setUpdateProjectData(null);
          }}
        />
  
        <AlertDialog open={!!deleteProjectModal} onOpenChange={() => setDeleteProject(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to delete this project?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete {deleteProjectModal?.name} and all of its contents. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteProjectModal?.id && handleDelete(deleteProjectModal.id)}
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
