import CreateProjectForm from "@/components/forms/projectform";
import Sidebar from "@/components/sidebar";

export default function ProjectPage() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-1 items-center justify-center p-4">
        <CreateProjectForm />
      </div>
    </div>
  );
}
