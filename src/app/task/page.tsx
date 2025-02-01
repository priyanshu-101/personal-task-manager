import CreateTaskForm from "@/components/forms/task-from";
import Sidebar from "@/components/sidebar";

export default function TaskPage() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex flex-1 items-center justify-center p-4">
        <CreateTaskForm />
      </div>
    </div>
  );
}
