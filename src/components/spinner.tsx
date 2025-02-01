import { Loader2 } from "lucide-react";  

export default function Spinner() {
  return (
    <div className="flex items-center justify-center">
      <Loader2 className="animate-spin h-8 w-8 text-muted-foreground" />
    </div>
  );
}
