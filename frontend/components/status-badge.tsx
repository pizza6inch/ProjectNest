import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock4, AlertCircle } from "lucide-react";

export default function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "completed":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          <CheckCircle2 className="mr-1 h-3 w-3" />
          Completed
        </Badge>
      );
    case "in-progress":
      return (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          <Clock4 className="mr-1 h-3 w-3" />
          In Progress
        </Badge>
      );
    case "pending":
      return (
        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
          <AlertCircle className="mr-1 h-3 w-3" />
          Pending
        </Badge>
      );
    case "active":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          <CheckCircle2 className="mr-1 h-3 w-3" />
          Active
        </Badge>
      );
    case "inactive":
      return (
        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
          <AlertCircle className="mr-1 h-3 w-3" />
          Inactive
        </Badge>
      );
    default:
      return <Badge>{status}</Badge>;
  }
}
