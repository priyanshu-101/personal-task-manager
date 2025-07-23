import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { updatetask } from "@/api/task";

const formatDate = (date: Date | string | null) => {
  if (!date) return "Pick a date";
  
  const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = new Date(date).toLocaleDateString("en-US", options);
  
  const day = new Date(date).getDate();
  const suffix = day === 1 || day === 21 || day === 31 ? "st" :
                day === 2 || day === 22 ? "nd" :
                day === 3 || day === 23 ? "rd" : "th";

  return formattedDate.replace(day.toString(), `${day}${suffix}`);
};

interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  dueDate: string;
  projectId: string;
}

interface TaskUpdateModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: Date | null;
  projectId: string;
}

interface FormErrors {
  title?: string;
  projectId?: string;
}

const TaskUpdateModal = ({ task, isOpen, onClose, onSuccess }: TaskUpdateModalProps) => {
  const [formData, setFormData] = useState<FormData>({
    title: task?.title || "",
    description: task?.description || "",
    status: (task?.status || "").toLowerCase(),
    priority: task?.priority?.toString() || "",
    dueDate: task?.dueDate ? new Date(task?.dueDate) : null,
    projectId: task?.projectId?.toString() || "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: FormErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (!formData.projectId.trim()) {
      newErrors.projectId = "Project ID is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !task) {
      return;
    }

    setIsLoading(true);
    try {
      await updatetask(
        task.id,
        formData.title,
        formData.description,
        formData.status,
        formData.priority,
        formData.dueDate ? formData.dueDate.toISOString() : "",
        formData.projectId
      );
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error updating task:", error);
      if (error instanceof Error && error.message === "Title and Project ID are required") {
        setErrors({
          title: !formData.title.trim() ? "Title is required" : undefined,
          projectId: !formData.projectId.trim() ? "Project ID is required" : undefined,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <label htmlFor="title" className="text-sm font-medium">
                Task Title *
              </label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value });
                  if (errors.title) {
                    setErrors({ ...errors, title: "" });
                  }
                }}
                className={`w-full ${errors.title ? "border-red-500" : ""}`}
              />
              {errors.title && (
                <span className="text-red-500 text-sm">{errors.title}</span>
              )}
            </div>

            <div className="grid gap-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full min-h-24"
                placeholder="Enter task description..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="status" className="text-sm font-medium">
                  Status
                </label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="inprogress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <label htmlFor="priority" className="text-sm font-medium">
                  Priority
                </label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) =>
                    setFormData({ ...formData, priority: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Set priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="projectId" className="text-sm font-medium">
                  Project ID *
                </label>
                <Input
                  id="projectId"
                  value={formData.projectId}
                  onChange={(e) => {
                    setFormData({ ...formData, projectId: e.target.value });
                    if (errors.projectId) {
                      setErrors({ ...errors, projectId: "" });
                    }
                  }}
                  className={`w-full ${errors.projectId ? "border-red-500" : ""}`}
                  placeholder="Enter project ID"
                />
                {errors.projectId && (
                  <span className="text-red-500 text-sm">{errors.projectId}</span>
                )}
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">Due Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formatDate(formData.dueDate)}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.dueDate || undefined}
                      onSelect={(date) =>
                        setFormData({ ...formData, dueDate: date || null })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskUpdateModal;