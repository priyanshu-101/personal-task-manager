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
import { updateProject } from "@/api/project";
import Spinner from "@/components/spinner";

interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

interface UpdateProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const UpdateProjectModal = ({ project, isOpen, onClose, onSuccess }: UpdateProjectModalProps) => {
  const [formData, setFormData] = useState({
    name: project?.name || "",
    description: project?.description || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null);

    if (!project) return;

    try {
      setLoading(true);
      await updateProject(project.id, formData.name, formData.description);
      onSuccess();  
      onClose();    
    } catch (error) {
      setError("Error updating project. Please try again.");
      console.error("Error updating project:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Project</DialogTitle>
        </DialogHeader>
        {loading ? (
            <Spinner/>
          ):(<>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                Project Name
              </label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full"
              />
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
                className="w-full"
              />
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Project"}
            </Button>
          </DialogFooter>
        </form>
        </>
            )}
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProjectModal;
