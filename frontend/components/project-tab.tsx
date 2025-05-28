"use client";
import React, { FormEvent } from "react";
import { useState, useEffect } from "react";

import { Search, MoreHorizontal, Trash2, PencilLine, Plus, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import { Input } from "@/components/ui/input";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
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
import { Calendar } from "@/components/ui/calendar";

import RoleBadge from "@/components/role-badge";
import StatusBadge from "@/components/status-badge";
import Pagination from "./pagination";
import { Progress } from "@/components/ui/progress";
import { Eye } from "lucide-react";
import Link from "next/link";

import {
  getUserById,
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
import { formatTime } from "@/lib/utils";

export default function ProjectTab() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectSearchQuery, setProjectSearchQuery] = useState("");
  const [projectStatusFilter, setProjectStatusFilter] = useState("all");
  const [currentProjectPage, setCurrentProjectPage] = useState(1);
  const [isDeleteProjectDialogOpen, setIsDeleteProjectDialogOpen] = useState(false);
  const [isAddProjectDialogOpen, setIsAddProjectDialogOpen] = useState(false);
  const [isEditProjectDialogOpen, setIsEditProjectDialogOpen] = useState(false);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();

  const { setStats, projectCount } = useDashboardStats();

  const [members, setMembers] = useState<
    {
      id: string;
      data: User | null;
      loading: boolean;
      error: string | null;
    }[]
  >([{ id: "", data: null, loading: false, error: null }]);

  const addMember = () => {
    setMembers([...members, { id: "", data: null, loading: false, error: null }]);
  };

  const removeMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const handleMemberChange = (index: number, value: string) => {
    const newMembers = [...members];
    newMembers[index].id = value;
    newMembers[index].data = null;
    newMembers[index].error = null;
    setMembers(newMembers);
  };

  const confirmMemberId = async (index: number) => {
    const memberId = members[index].id.trim();
    if (!memberId) return;
    const newMembers = [...members];
    newMembers[index].loading = true;
    newMembers[index].error = null;
    newMembers[index].data = null;
    setMembers(newMembers);

    try {
      const user = await getUserById(memberId);

      // const data = await get_member_by_id(memberId);
      newMembers[index].data = user;
    } catch (error) {
      newMembers[index].error = "User not found";
    } finally {
      newMembers[index].loading = false;
      setMembers([...newMembers]);
    }
  };

  // add/edit project form
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [deadline, setDeadline] = useState("");

  const [itemsPerPage] = useState(10); // 10 items per page for tables

  const fetchProjects = async () => {
    try {
      const response: GetProjectsResponse = await getProjects({
        status: projectStatusFilter !== "all" ? projectStatusFilter : undefined,
        page: currentProjectPage,
        pageSize: itemsPerPage,
        keyword: projectSearchQuery,
      });

      setProjects(response.results);
      setStats({ projectCount: response.total });
      console.log("Fetched projects:", response.results);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleAddProject = async () => {
    console.log("data", {
      title,
      description,
      status,
      deadline,
      members,
    });
    if (!title || !description || !status || members.length === 0) {
      toast({
        title: "Add Project Error",
        description: "All fields are required",
      });
      return;
    }

    try {
      setIsLoading(true);

      await createProject({
        title,
        status,
        deadline,
        progress: 0,
        description,
        users: members.map((m) => m.data?.user_id || ""),
      });

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
    if (!title || !description || !status || members.length === 0) {
      toast({
        title: "Edit Project Error",
        description: "All fields are required",
      });
      return;
    }

    try {
      setIsLoading(true);

      await updateProject({
        project_id: selectedProject?.project_id || "",
        title,
        description,
        status,
        deadline,
        progress: selectedProject?.progress || 0,
        users: members.map((m) => m.data?.user_id || ""),
      });

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
    setMembers([]);
  }, [isAddProjectDialogOpen]);

  useEffect(() => {
    if (selectedProject) {
      setTitle(selectedProject?.title);
      setDescription(selectedProject?.description);
      setStatus(selectedProject?.status);
      setDeadline(selectedProject?.deadline || "");

      // TODO:fetch member只能用detail API 所以等後端
      // setMembers(
      //   selectedProject?.users.map((user) => ({
      //     id: user.user_id || "",
      //     data: user,
      //     loading: false,
      //     error: null,
      //   })) || []
      // );
    }
  }, [selectedProject]);

  useEffect(() => {
    fetchProjects();
  }, [projectStatusFilter, currentProjectPage, itemsPerPage]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentProjectPage(1);
  }, [projectStatusFilter]);

  return (
    <>
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
                  placeholder="Search projects by name or email..."
                  className="w-full pl-8"
                  value={projectSearchQuery}
                  onChange={(e) => setProjectSearchQuery(e.target.value)}
                />
              </div>
              <Button
                onClick={() => {
                  setCurrentProjectPage(1);
                  fetchProjects();
                }}
                className="h-10 self-center"
              >
                Search
              </Button>
              <div className="flex gap-2 w-full sm:w-auto">
                <Select value={projectStatusFilter} onValueChange={setProjectStatusFilter}>
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
                <Dialog open={isAddProjectDialogOpen} onOpenChange={setIsAddProjectDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Project
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add New Project</DialogTitle>
                      <DialogDescription>Create a new project in the system.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="project_title" className="text-right">
                          Project Title
                        </Label>
                        <Input id="project_title" onChange={(e) => setTitle(e.target.value)} className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                          Description
                        </Label>
                        <Input
                          id="description"
                          onChange={(e) => setDescription(e.target.value)}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="status" className="text-right">
                          Status
                        </Label>
                        <Select onValueChange={(value) => setStatus(value)}>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="done">Done</SelectItem>
                            <SelectItem value="in_progress">In-Progress</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="deadline" className="text-right">
                          Deadline
                        </Label>
                        <div className="col-span-3">
                          <Calendar
                            mode="single"
                            selected={deadline ? new Date(deadline) : undefined}
                            onSelect={(date) => setDeadline(date ? date.toISOString() : "")}
                            disabled={isLoading}
                          />
                          {deadline && (
                            <p className="mt-2 text-sm text-muted-foreground">Selected date: {formatTime(deadline)}</p>
                          )}
                        </div>
                      </div>

                      {/* Members input with preview */}
                      <div className="grid grid-cols-4 items-start gap-4">
                        <Label className="text-right pt-2">Members</Label>
                        <div className="col-span-3 space-y-4">
                          {members.map((member, index) => (
                            <div key={index} className="border rounded p-3">
                              <div className="flex items-center gap-2 mb-2">
                                <Input
                                  placeholder="Enter member ID"
                                  value={member.id}
                                  onChange={(e) => handleMemberChange(index, e.target.value)}
                                  className="flex-1"
                                />
                                <Button type="button" onClick={() => confirmMemberId(index)} disabled={member.loading}>
                                  {member.loading ? "Loading..." : "Confirm"}
                                </Button>
                                <Button type="button" variant="destructive" onClick={() => removeMember(index)}>
                                  Remove
                                </Button>
                              </div>
                              {member.error && <p className="text-red-600 text-sm">{member.error}</p>}
                              {member.data && member.data.name && (
                                <div className="bg-gray-50 p-2 rounded flex items-center gap-2 text-sm">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage
                                      src={member.data.image_url || "/placeholder-user.jpg"}
                                      alt={member.data.name}
                                    />
                                    <AvatarFallback>
                                      {member.data.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex flex-col">
                                    <span className="text-sm font-medium">{member.data.name}</span>
                                    <span className="text-xs text-muted-foreground">{member.data.role}</span>
                                  </div>
                                  <span className="">{member.data.email}</span>
                                </div>
                              )}
                            </div>
                          ))}
                          <Button type="button" onClick={addMember}>
                            Add Member
                          </Button>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      {isLoading ? (
                        <Button disabled>
                          <Loader2 className="animate-spin" />
                          Creating...
                        </Button>
                      ) : (
                        <Button onClick={() => handleAddProject()} type="submit">
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
                          <Link href={`/projects/${project.project_id}`}>
                            <div className="font-medium">{project.title}</div>
                            <div className="text-xs text-muted-foreground">ID: {project.project_id}</div>
                          </Link>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={project.status} />
                        </TableCell>
                        <TableCell>{project.professor_user ? project.professor_user.name : "N/A"}</TableCell>
                        <TableCell>{project.user_count}</TableCell>
                        <TableCell>{formatTime(project.deadline)}</TableCell>
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
      <Dialog open={isEditProjectDialogOpen} onOpenChange={setIsEditProjectDialogOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
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
              <Input id="project_id" onChange={(e) => setTitle(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Description
              </Label>
              <Input id="name" className="col-span-3" onChange={(e) => setDescription(e.target.value)} />
            </div>

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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="deadline" className="text-right">
                Deadline
              </Label>
              <div className="col-span-3">
                <Calendar
                  mode="single"
                  selected={deadline ? new Date(deadline) : undefined}
                  onSelect={(date) => setDeadline(date ? date.toISOString() : "")}
                  disabled={isLoading}
                />
                {deadline && (
                  <p className="mt-2 text-sm text-muted-foreground">Selected date: {formatTime(deadline)}</p>
                )}
              </div>
            </div>

            {/* Members input with preview */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Members</Label>
              <div className="col-span-3 space-y-4">
                {members.map((member, index) => (
                  <div key={index} className="border rounded p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Input
                        placeholder="Enter member ID"
                        value={member.id}
                        onChange={(e) => handleMemberChange(index, e.target.value)}
                        className="flex-1"
                      />
                      <Button type="button" onClick={() => confirmMemberId(index)} disabled={member.loading}>
                        {member.loading ? "Loading..." : "Confirm"}
                      </Button>
                      <Button type="button" variant="destructive" onClick={() => removeMember(index)}>
                        Remove
                      </Button>
                    </div>
                    {member.error && <p className="text-red-600 text-sm">{member.error}</p>}
                    {member.data && member.data.name && (
                      <div className="bg-gray-50 p-2 rounded flex items-center gap-2 text-sm">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.data.image_url || "/placeholder-user.jpg"} alt={member.data.name} />
                          <AvatarFallback>
                            {member.data.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{member.data.name}</span>
                          <span className="text-xs text-muted-foreground">{member.data.role}</span>
                        </div>
                        <span className="">{member.data.email}</span>
                      </div>
                    )}
                  </div>
                ))}
                <Button type="button" onClick={addMember}>
                  Add Member
                </Button>
              </div>
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
      <Dialog open={isDeleteProjectDialogOpen} onOpenChange={setIsDeleteProjectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this project(project_id:
              {selectedProject?.project_id})? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteProjectDialogOpen(false)}>
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
