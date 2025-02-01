"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getProjects } from "@/api/project";
import Spinner from "@/components/spinner";

export default function Dashboard() {
  const [greeting, setGreeting] = useState("Good morning");
  const router = useRouter();

  const storedUser = JSON.parse(localStorage.getItem("user") || "null");

  const { data: projects = [], isLoading, error } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 12 && hour < 18) setGreeting("Good afternoon");
    else if (hour >= 18) setGreeting("Good evening");
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">{greeting}, {storedUser?.name} 👋</h1>
          <p className="text-gray-600">Here's an overview of your projects.</p>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Your Projects</h2>
          <Button variant="default" className="flex items-center gap-2" onClick={() => router.push("/project")}>            
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
                className="shadow-md hover:shadow-lg transition cursor-pointer"
                onClick={() => router.push(`/projects/${project.id}`)}
              >
                <CardHeader>
                  <CardTitle>{project.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{project.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
