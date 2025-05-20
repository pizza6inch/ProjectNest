"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  FolderKanban,
  BarChart3,
  Shield,
  Search,
  MoreHorizontal,
  CheckCircle2,
  Clock4,
  AlertCircle,
  Trash2,
  PencilLine,
  Eye,
  UserPlus,
  Plus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import React from "react";

import OverviewTab from "@/components/overview-tab";
import UserTab from "@/components/user-tab";

import { DashboardStatsProvider } from "@/contexts/DashboardStatsContext";
// Mock data for projects
const projects = [
  {
    id: "1",
    title: "Machine Learning Algorithm Comparison",
    status: "in-progress",
    deadline: "2025-06-15",
    progress: 65,
    professor: "Dr. Williams",
    memberCount: 3,
    lastUpdated: "2 days ago",
  },
  {
    id: "2",
    title: "Web Application Security Analysis",
    status: "pending",
    deadline: "2025-07-01",
    progress: 10,
    professor: "Dr. Garcia",
    memberCount: 2,
    lastUpdated: "5 days ago",
  },
  {
    id: "3",
    title: "Database Optimization Techniques",
    status: "completed",
    deadline: "2025-05-20",
    progress: 100,
    professor: "Dr. Williams",
    memberCount: 3,
    lastUpdated: "1 week ago",
  },
  {
    id: "4",
    title: "Mobile App Development for Campus Services",
    status: "in-progress",
    deadline: "2025-06-30",
    progress: 45,
    professor: "Dr. Garcia",
    memberCount: 2,
    lastUpdated: "3 days ago",
  },
  {
    id: "5",
    title: "Natural Language Processing Research",
    status: "in-progress",
    deadline: "2025-07-15",
    progress: 30,
    professor: "Dr. Williams",
    memberCount: 2,
    lastUpdated: "1 day ago",
  },
  {
    id: "6",
    title: "Cloud Infrastructure Deployment",
    status: "pending",
    deadline: "2025-08-01",
    progress: 5,
    professor: "Dr. Garcia",
    memberCount: 3,
    lastUpdated: "1 week ago",
  },
];

// Status badge component
function StatusBadge({ status }: { status: string }) {
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

// Role badge component

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("all");
  const [projectSearchQuery, setProjectSearchQuery] = useState("");
  const [projectStatusFilter, setProjectStatusFilter] = useState("all");
  const [isDeleteUserDialogOpen, setIsDeleteUserDialogOpen] = useState(false);
  const [isDeleteProjectDialogOpen, setIsDeleteProjectDialogOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [currentUserPage, setCurrentUserPage] = useState(1);
  const [currentProjectPage, setCurrentProjectPage] = useState(1);
  const [itemsPerPage] = useState(10); // 10 items per page for tables
  const [userCount, setUserCount] = useState(0);

  // Filter users based on search and role filter
  // const filteredUsers = users.filter((user) => {
  //   const matchesSearch =
  //     user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
  //     user.email.toLowerCase().includes(userSearchQuery.toLowerCase())
  //   const matchesRole = userRoleFilter === "all" || user.role === userRoleFilter
  //   return matchesSearch && matchesRole
  // })

  // // Filter projects based on search and status filter
  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(projectSearchQuery.toLowerCase());
    const matchesStatus = projectStatusFilter === "all" || project.status === projectStatusFilter;
    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    setCurrentProjectPage(1);
  }, [projectSearchQuery, projectStatusFilter]);

  // Handle delete project
  const handleDeleteProject = () => {
    console.log(`Deleting project with ID: ${selectedItemId}`);
    setIsDeleteProjectDialogOpen(false);
    setSelectedItemId(null);
    // In a real app, this would call an API to delete the project
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Shield className="h-8 w-8 text-red-600" />
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">Manage users, projects, and system settings</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-3 md:w-[400px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
          </TabsList>

          <DashboardStatsProvider>
            {/* Overview Tab */}
            <OverviewTab setActiveTab={setActiveTab} />

            {/* Users Tab */}
            <UserTab />

            {/* Projects Tab */}
            <TabsContent value="projects" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Project Management</CardTitle>
                  <CardDescription>View and manage all projects in the system</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="relative flex-1">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search projects..."
                        className="w-full pl-8"
                        value={projectSearchQuery}
                        onChange={(e) => setProjectSearchQuery(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Select value={projectStatusFilter} onValueChange={setProjectStatusFilter}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        New Project
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Project</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Professor</TableHead>
                          <TableHead>Members</TableHead>
                          <TableHead>Deadline</TableHead>
                          <TableHead>Progress</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredProjects.length > 0 ? (
                          filteredProjects
                            .slice((currentProjectPage - 1) * itemsPerPage, currentProjectPage * itemsPerPage)
                            .map((project) => (
                              <TableRow key={project.id}>
                                <TableCell>
                                  <div className="font-medium">{project.title}</div>
                                  <div className="text-xs text-muted-foreground">ID: {project.id}</div>
                                </TableCell>
                                <TableCell>
                                  <StatusBadge status={project.status} />
                                </TableCell>
                                <TableCell>{project.professor}</TableCell>
                                <TableCell>{project.memberCount}</TableCell>
                                <TableCell>{new Date(project.deadline).toLocaleDateString()}</TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Progress value={project.progress} className="h-2 w-[60px]" />
                                    <span className="text-xs">{project.progress}%</span>
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="h-4 w-4" />
                                        <span className="sr-only">Actions</span>
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem asChild>
                                        <Link href={`/projects/${project.id}`}>
                                          <Eye className="mr-2 h-4 w-4" />
                                          View Project
                                        </Link>
                                      </DropdownMenuItem>
                                      <DropdownMenuItem>
                                        <PencilLine className="mr-2 h-4 w-4" />
                                        Edit Project
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem
                                        className="text-red-600"
                                        onClick={() => {
                                          setSelectedItemId(project.id);
                                          setIsDeleteProjectDialogOpen(true);
                                        }}
                                      >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete Project
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                            ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={7} className="h-24 text-center">
                              No projects found.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
              {filteredProjects.length > 0 && (
                <div className="flex justify-center mt-6">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentProjectPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentProjectPage === 1}
                    >
                      Previous
                    </Button>
                    <div className="flex items-center space-x-1">
                      {(() => {
                        const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
                        const pages = [];

                        if (totalPages <= 5) {
                          // Less than 5 pages, show all
                          for (let i = 1; i <= totalPages; i++) {
                            pages.push(
                              <Button
                                key={i}
                                variant={currentProjectPage === i ? "default" : "outline"}
                                size="sm"
                                className="w-9"
                                onClick={() => setCurrentProjectPage(i)}
                              >
                                {i}
                              </Button>
                            );
                          }
                        } else {
                          // More than 5 pages, show current page and neighbors
                          let startPage = Math.max(1, currentProjectPage - 2);
                          const endPage = Math.min(totalPages, startPage + 4);

                          if (endPage - startPage < 4) {
                            startPage = Math.max(1, endPage - 4);
                          }

                          // First page
                          if (startPage > 1) {
                            pages.push(
                              <Button
                                key={1}
                                variant={currentProjectPage === 1 ? "default" : "outline"}
                                size="sm"
                                className="w-9"
                                onClick={() => setCurrentProjectPage(1)}
                              >
                                1
                              </Button>
                            );

                            if (startPage > 2) {
                              pages.push(
                                <span key="ellipsis1" className="mx-1">
                                  ...
                                </span>
                              );
                            }
                          }

                          // Page numbers
                          for (let i = startPage; i <= endPage; i++) {
                            pages.push(
                              <Button
                                key={i}
                                variant={currentProjectPage === i ? "default" : "outline"}
                                size="sm"
                                className="w-9"
                                onClick={() => setCurrentProjectPage(i)}
                              >
                                {i}
                              </Button>
                            );
                          }

                          // Last page
                          if (endPage < totalPages) {
                            if (endPage < totalPages - 1) {
                              pages.push(
                                <span key="ellipsis2" className="mx-1">
                                  ...
                                </span>
                              );
                            }

                            pages.push(
                              <Button
                                key={totalPages}
                                variant={currentProjectPage === totalPages ? "default" : "outline"}
                                size="sm"
                                className="w-9"
                                onClick={() => setCurrentProjectPage(totalPages)}
                              >
                                {totalPages}
                              </Button>
                            );
                          }
                        }

                        return pages;
                      })()}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentProjectPage((prev) =>
                          Math.min(prev + 1, Math.ceil(filteredProjects.length / itemsPerPage))
                        )
                      }
                      disabled={currentProjectPage === Math.ceil(filteredProjects.length / itemsPerPage)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
          </DashboardStatsProvider>
        </Tabs>
      </div>

      {/* Delete Project Confirmation Dialog */}
      <Dialog open={isDeleteProjectDialogOpen} onOpenChange={setIsDeleteProjectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this project? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteProjectDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProject}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
