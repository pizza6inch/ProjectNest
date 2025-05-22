"use client";
import React, { FormEvent } from "react";
import { useState, useEffect } from "react";

import {
  Search,
  MoreHorizontal,
  Trash2,
  PencilLine,
  Plus,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

import { Input } from "@/components/ui/input";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

import RoleBadge from "@/components/role-badge";
import StatusBadge from "@/components/status-badge";
import Pagination from "./pagination";
import { Progress } from "@/components/ui/progress";
import { Eye } from "lucide-react";
import Link from "next/link";

import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  Project,
  GetProjectsResponse,
} from "@/lib/apiClient";
import { User } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useDashboardStats } from "@/hooks/dashBoardStatsContext";

export default function ProjectTab() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectSearchQuery, setProjectSearchQuery] = useState("");
  const [projectStatusFilter, setProjectStatusFilter] = useState("all");
  const [currentProjectPage, setCurrentProjectPage] = useState(1);
  const [isDeleteProjectDialogOpen, setIsDeleteProjectDialogOpen] =
    useState(false);
  const [isAddProjectDialogOpen, setIsAddProjectDialogOpen] = useState(false);
  const [isEditProjectDialogOpen, setIsEditProjectDialogOpen] = useState(false);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();

  const { setStats, projectCount } = useDashboardStats();

  // add/edit project form
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [groupMembers, setGroupMembers] = useState<User[]>([]);

  const [itemsPerPage] = useState(10); // 10 items per page for tables

  const fetchProjects = async () => {
    try {
      const response: GetProjectsResponse = await getProjects({
        status: projectStatusFilter !== "all" ? projectStatusFilter : undefined,
        page: currentProjectPage,
        pageSize: itemsPerPage,
      });

      setProjects(response.results);
      setStats({ projectCount: response.total });
      console.log("Fetched projects:", response.results);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleAddProject = async () => {
    if (!title || !description || !status || groupMembers.length === 0) {
      toast({
        title: "Add Project Error",
        description: "All fields are required",
      });
      return;
    }

    try {
      setIsLoading(true);
      // TODO::等候端
      await createProject({ user_id: userId, name, email, password, role });

      setIsAddProjectDialogOpen(false);
      toast({ title: "Add Project Success" });
      fetchProjects();
    } catch (err) {
      toast({ title: "Add Project Error", description: `${err}` });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProject = async () => {
    if (!title || !description || !status || groupMembers.length === 0) {
      toast({
        title: "Edit Project Error",
        description: "All fields are required",
      });
      return;
    }

    try {
      setIsLoading(true);

      await updateProject({ user_id: userId, name, email, password, role });

      toast({ title: "Edit Project Success" });
      setIsEditProjectDialogOpen(false);

      setSelectedProject(null);
      fetchProjects();
    } catch (err) {
      toast({ title: "Edit Project Error", description: `${err}` });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = async () => {
    console.log(`Deleting proejct with ID: ${selectedProject?.project_id}`);

    if (!selectedProject) return;

    try {
      setIsLoading(true);

      await deleteProject(selectedProject?.project_id);

      toast({ title: "Delete Project Success" });
      setIsDeleteProjectDialogOpen(false);
      setSelectedProject(null);
      fetchProjects();
    } catch (err) {
      toast({ title: "Delete Project Error", description: `${err}` });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setTitle("");
    setDescription("");
    setStatus("");
    setGroupMembers([]);
  }, [isAddProjectDialogOpen]);

  useEffect(() => {
    if (selectedProject) {
      setTitle(selectedProject?.title);
      setDescription(selectedProject?.description);
      setStatus(selectedProject?.status);
      // setGroupMembers(selectedProject?.groupMembers);
    }
  }, [selectedProject]);

  useEffect(() => {
    fetchProjects();
  }, [projectStatusFilter, currentProjectPage, itemsPerPage]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentProjectPage(1);
  }, [projectSearchQuery, projectStatusFilter]);

  return (
    <>
      <TabsContent value="projects" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Project Management</CardTitle>
            <CardDescription>
              View and manage all projects in the system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search projects by name or email..."
                  className="w-full pl-8"
                  value={projectSearchQuery}
                  onChange={(e) => setProjectSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Select
                  value={projectStatusFilter}
                  onValueChange={setProjectStatusFilter}
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {/* <SelectItem value="admin">Admin</SelectItem> */}
                    <SelectItem value="done">Done</SelectItem>
                    <SelectItem value="in_progress">In-Progress</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
                {/* add project dialog */}
                <Dialog
                  open={isAddProjectDialogOpen}
                  onOpenChange={setIsAddProjectDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Project
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Project</DialogTitle>
                      <DialogDescription>
                        Create a new project in the system.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="project_title" className="text-right">
                          ProjectTitle
                        </Label>
                        <Input
                          id="project_title"
                          onChange={(e) => setTitle(e.target.value)}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Description
                        </Label>
                        <Input
                          id="name"
                          className="col-span-3"
                          onChange={(e) => setDescription(e.target.value)}
                        />
                      </div>
                      {/* <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          className="col-span-3"
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="password" className="text-right">
                          Password
                        </Label>
                        <Input
                          id="password"
                          className="col-span-3"
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div> */}
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="role" className="text-right">
                          Status
                        </Label>
                        <Select onValueChange={(value) => setStatus(value)}>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            {/* <SelectItem value="admin">Admin</SelectItem> */}
                            <SelectItem value="done">Done</SelectItem>
                            <SelectItem value="in_progress">
                              In-Progress
                            </SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      {isLoading ? (
                        <Button disabled>
                          <Loader2 className="animate-spin" />
                          Creating...
                        </Button>
                      ) : (
                        <Button onClick={handleAddProject} type="submit">
                          Create Project
                        </Button>
                      )}
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead>status</TableHead>
                    <TableHead>Professor</TableHead>
                    <TableHead>Members</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.length > 0 ? (
                    projects.map((project) => (
                      <TableRow key={project.project_id}>
                        <TableCell>
                          <div className="font-medium">{project.title}</div>
                          <div className="text-xs text-muted-foreground">
                            ID: {project.project_id}
                          </div>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={project.status} />
                        </TableCell>
                        <TableCell>{project.professor}</TableCell>
                        {/* TODO::等候端 */}
                        {/* <TableCell>{project.memberCount}</TableCell> */}
                        <TableCell>{6}</TableCell>
                        <TableCell>
                          {new Date(project.deadline).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress
                              value={project.progress}
                              className="h-2 w-[60px]"
                            />
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
                                <Link href={`/projects/${project.project_id}`}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Project
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedProject(project);
                                  setIsEditProjectDialogOpen(true);
                                }}
                              >
                                <PencilLine className="mr-2 h-4 w-4" />
                                Edit Project
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => {
                                  setSelectedProject(project);
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
                      <TableCell colSpan={6} className="h-24 text-center">
                        No projects found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        <Pagination
          total={projectCount}
          page={currentProjectPage}
          pageSize={itemsPerPage}
          onPageChange={setCurrentProjectPage}
        />
      </TabsContent>

      {/* edit project dialog */}
      <Dialog
        open={isEditProjectDialogOpen}
        onOpenChange={setIsEditProjectDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Edit Project {selectedProject?.title}(project_id:
              {selectedProject?.project_id}) in the system.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="project_id" className="text-right">
                ProjectTitle
              </Label>
              <Input
                id="project_id"
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Description
              </Label>
              <Input
                id="name"
                className="col-span-3"
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            {/* <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          className="col-span-3"
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="password" className="text-right">
                          Password
                        </Label>
                        <Input
                          id="password"
                          className="col-span-3"
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div> */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Status
              </Label>
              <Select onValueChange={(value) => setStatus(value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {/* <SelectItem value="admin">Admin</SelectItem> */}
                  <SelectItem value="done">Done</SelectItem>
                  <SelectItem value="in_progress">In-Progress</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            {isLoading ? (
              <Button disabled>
                <Loader2 className="animate-spin" />
                Saving Changes...
              </Button>
            ) : (
              <Button onClick={handleEditProject} type="submit">
                Save Changes
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* delete project dialog */}
      <Dialog
        open={isDeleteProjectDialogOpen}
        onOpenChange={setIsDeleteProjectDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this project(project_id:
              {selectedProject?.project_id})? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteProjectDialogOpen(false)}
            >
              Cancel
            </Button>
            {isLoading ? (
              <Button disabled>
                <Loader2 className="animate-spin" />
                Deleting...
              </Button>
            ) : (
              <Button variant="destructive" onClick={handleDeleteProject}>
                Delete
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
