"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Clock,
  Filter,
  Search,
  SortAsc,
  SortDesc,
  CheckCircle2,
  AlertCircle,
  Clock4,
  User,
  Calendar,
  MoreHorizontal,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  getProjects,
  getUsers,
  GetProjectsResponse,
  Project,
} from "@/lib/apiClient";

import StatusBadge from "@/components/status-badge";
// Mock data for projects
// const projects = [
//   {
//     id: "1",
//     title: "Machine Learning Algorithm Comparison",
//     status: "in-progress",
//     deadline: "2025-06-15",
//     progress: 65,
//     teamLead: {
//       name: "Sarah Johnson",
//       avatar: "/placeholder-user.jpg",
//       initials: "SJ",
//     },
//     professor: "Dr. Williams",
//     members: [
//       {
//         name: "Sarah Johnson",
//         avatar: "/placeholder-user.jpg",
//         initials: "SJ",
//         role: "Team Lead",
//       },
//       {
//         name: "Alex Thompson",
//         avatar: "/placeholder-user.jpg",
//         initials: "AT",
//         role: "Student",
//       },
//       {
//         name: "Maya Patel",
//         avatar: "/placeholder-user.jpg",
//         initials: "MP",
//         role: "Student",
//       },
//     ],
//     lastUpdated: "2 days ago",
//   },
//   {
//     id: "2",
//     title: "Web Application Security Analysis",
//     status: "pending",
//     deadline: "2025-07-01",
//     progress: 10,
//     teamLead: {
//       name: "Michael Chen",
//       avatar: "/placeholder-user.jpg",
//       initials: "MC",
//     },
//     professor: "Dr. Garcia",
//     members: [
//       {
//         name: "Michael Chen",
//         avatar: "/placeholder-user.jpg",
//         initials: "MC",
//         role: "Team Lead",
//       },
//       {
//         name: "Lisa Wang",
//         avatar: "/placeholder-user.jpg",
//         initials: "LW",
//         role: "Student",
//       },
//     ],
//     lastUpdated: "5 days ago",
//   },
//   {
//     id: "3",
//     title: "Database Optimization Techniques",
//     status: "completed",
//     deadline: "2025-05-20",
//     progress: 100,
//     teamLead: {
//       name: "Emily Rodriguez",
//       avatar: "/placeholder-user.jpg",
//       initials: "ER",
//     },
//     professor: "Dr. Williams",
//     members: [
//       {
//         name: "Emily Rodriguez",
//         avatar: "/placeholder-user.jpg",
//         initials: "ER",
//         role: "Team Lead",
//       },
//       {
//         name: "Daniel Park",
//         avatar: "/placeholder-user.jpg",
//         initials: "DP",
//         role: "Student",
//       },
//       {
//         name: "Sophia Lee",
//         avatar: "/placeholder-user.jpg",
//         initials: "SL",
//         role: "Student",
//       },
//     ],
//     lastUpdated: "1 week ago",
//   },
//   {
//     id: "4",
//     title: "Mobile App Development for Campus Services",
//     status: "in-progress",
//     deadline: "2025-06-30",
//     progress: 45,
//     teamLead: {
//       name: "David Kim",
//       avatar: "/placeholder-user.jpg",
//       initials: "DK",
//     },
//     professor: "Dr. Garcia",
//     members: [
//       {
//         name: "David Kim",
//         avatar: "/placeholder-user.jpg",
//         initials: "DK",
//         role: "Team Lead",
//       },
//       {
//         name: "Rachel Chen",
//         avatar: "/placeholder-user.jpg",
//         initials: "RC",
//         role: "Student",
//       },
//     ],
//     lastUpdated: "3 days ago",
//   },
//   {
//     id: "5",
//     title: "Natural Language Processing Research",
//     status: "in-progress",
//     deadline: "2025-07-15",
//     progress: 30,
//     teamLead: {
//       name: "Olivia Smith",
//       avatar: "/placeholder-user.jpg",
//       initials: "OS",
//     },
//     professor: "Dr. Williams",
//     members: [
//       {
//         name: "Olivia Smith",
//         avatar: "/placeholder-user.jpg",
//         initials: "OS",
//         role: "Team Lead",
//       },
//       {
//         name: "James Wilson",
//         avatar: "/placeholder-user.jpg",
//         initials: "JW",
//         role: "Student",
//       },
//     ],
//     lastUpdated: "1 day ago",
//   },
//   {
//     id: "6",
//     title: "Cloud Infrastructure Deployment",
//     status: "pending",
//     deadline: "2025-08-01",
//     progress: 5,
//     teamLead: {
//       name: "James Wilson",
//       avatar: "/placeholder-user.jpg",
//       initials: "JW",
//     },
//     professor: "Dr. Garcia",
//     members: [
//       {
//         name: "James Wilson",
//         avatar: "/placeholder-user.jpg",
//         initials: "JW",
//         role: "Team Lead",
//       },
//       {
//         name: "Emma Davis",
//         avatar: "/placeholder-user.jpg",
//         initials: "ED",
//         role: "Student",
//       },
//       {
//         name: "Noah Martinez",
//         avatar: "/placeholder-user.jpg",
//         initials: "NM",
//         role: "Student",
//       },
//     ],
//     lastUpdated: "1 week ago",
//   },
// ]
import Pagination from "@/components/pagination";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [professorFilter, setprofessorFilter] = useState("all");
  const [sortBy, setSortBy] = useState("lastUpdated");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6); // 6 items per page (2 rows of 3 cards)
  const [loading, setLoading] = useState(false);

  const [projects, setProjects] = useState<Project[]>([]);
  const [totalProjectsCount, setTotalProjectsCount] = useState(0);

  const fetchProjects = async () => {
    try {
      const response: GetProjectsResponse = await getProjects({
        status: statusFilter !== "all" ? statusFilter : undefined,
        page: currentPage,
        pageSize: itemsPerPage,
        keyword: searchQuery,
      });

      setProjects(response.results);
      setTotalProjectsCount(response.total);
      console.log("Fetched projects:", response.results);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
    fetchProjects();
  }, [statusFilter, professorFilter, sortBy, professorFilter]);

  useEffect(() => {
    fetchProjects();
  }, [currentPage, itemsPerPage]);

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
            <p className="text-muted-foreground">
              Browse and manage all academic projects
            </p>
          </div>
          <Button>Create New Project</Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search projects..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-1">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="p-2">
                  <div className="mb-2">
                    <p className="text-xs font-medium mb-1">Status</p>
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <p className="text-xs font-medium mb-1">Professor</p>
                    <Select
                      value={professorFilter}
                      onValueChange={setprofessorFilter}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select professor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Professors</SelectItem>
                        <SelectItem value="Dr. Williams">
                          Dr. Williams
                        </SelectItem>
                        <SelectItem value="Dr. Garcia">Dr. Garcia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-1">
                  {sortBy === "lastUpdated" ? (
                    <SortDesc className="h-4 w-4" />
                  ) : (
                    <SortAsc className="h-4 w-4" />
                  )}
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortBy("lastUpdated")}>
                  Last Updated
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("progress")}>
                  Progress
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("deadline")}>
                  Deadline
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link
              href={`/projects/${project.project_id}`}
              key={project.project_id}
              className="block"
            >
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <StatusBadge status={project.status} />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="-mr-2 -mt-2"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit Project</DropdownMenuItem>
                        <DropdownMenuItem>Track Project</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardTitle className="line-clamp-2">
                    {project.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-3 text-sm text-muted-foreground">
                    {project.description || "No description provided."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>Members: {project.user_count}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Deadline:{" "}
                        {new Date(project.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
                {project.professor_user && (
                  <CardFooter className="pt-2">
                    <div className="flex items-center gap-2 w-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={
                            project.professor_user.user_id || "/placeholder.svg"
                          }
                          alt={project.professor_user.name}
                        />
                        <AvatarFallback>
                          {project.professor_user.name}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {project.professor_user.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Professor
                        </span>
                      </div>
                      <div className="ml-auto flex items-center text-xs text-muted-foreground">
                        <Clock className="mr-1 h-3 w-3" />
                        {project.update_at}
                      </div>
                    </div>
                  </CardFooter>
                )}
              </Card>
            </Link>
          ))}
        </div>

        {/* {filteredProjects.length > 0 && (
          <div className="flex justify-center mt-6">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  // Show first page, last page, current page, and pages around current
                  let pageNum = i + 1;

                  if (totalPages > 5) {
                    if (currentPage <= 3) {
                      // Near start: show first 5 pages
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      // Near end: show last 5 pages
                      pageNum = totalPages - 4 + i;
                    } else {
                      // Middle: show current page and 2 pages on each side
                      pageNum = currentPage - 2 + i;
                    }
                  }

                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      className="w-9"
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}

                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <>
                    {currentPage < totalPages - 3 && (
                      <span className="mx-1">...</span>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-9"
                      onClick={() => setCurrentPage(totalPages)}
                    >
                      {totalPages}
                    </Button>
                  </>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )} */}
        <Pagination
          total={totalProjectsCount}
          page={currentPage}
          pageSize={itemsPerPage}
          onPageChange={setCurrentPage}
        />
        {projects.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium">No projects found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
