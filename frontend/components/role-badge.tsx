import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";

export default function RoleBadge({ role }: { role: string }) {
  switch (role) {
    case "admin":
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
          <Shield className="mr-1 h-3 w-3" />
          Admin
        </Badge>
      );
    case "professor":
      return (
        <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
          Professor
        </Badge>
      );
    case "student":
      return (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          Student
        </Badge>
      );
    default:
      return <Badge>{role}</Badge>;
  }
}
