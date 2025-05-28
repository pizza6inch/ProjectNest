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
  Calendar as CalendarIcon,
  Plus,
  MoreHorizontal,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { getProjects, getUsers, GetProjectsResponse, Project } from "@/lib/apiClient";

import StatusBadge from "@/components/status-badge";

import Pagination from "@/components/pagination";

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

import { Loader2 } from "lucide-react";
import { getUserById, createProject } from "@/lib/apiClient";
import { User as UserType } from "@/lib/types";

import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { formatTime } from "@/lib/utils";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [professorFilter, setprofessorFilter] = useState("all");
  const [sortBy, setSortBy] = useState("lastUpdated");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6); // 6 items per page (2 rows of 3 cards)
  const [isLoading, setIsLoading] = useState(false);

  const [projects, setProjects] = useState<Project[]>([]);
  const [totalProjectsCount, setTotalProjectsCount] = useState(0);

  const { user } = useAuth();
  const { toast } = useToast();

  // Add Project Dialog State
  const [isAddProjectDialogOpen, setIsAddProjectDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("in_progress");
  const [deadline, setDeadline] = useState("");

  const [members, setMembers] = useState<
    {
      id: string;
      data: UserType | null;
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

  const handleOpenAddProjectDialog = () => {
    if (user?.role === null || user?.role === undefined) {
      toast({
        title: "Add Project Error",
        description: "You must be logged in to add a project",
      });
      console.log("User not logged in or role is undefined");

      return;
    }
    setIsAddProjectDialogOpen(true);
  };

  const handleAddProject = async () => {
    if (isLoading) return; // Prevent multiple submissions

    if (user?.role === null || user?.role === undefined) {
      toast({
        title: "Add Project Error",
        description: "You must be logged in to add a project",
      });
      return;
    }

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

  const fetchProjects = async () => {
    try {
      const response: GetProjectsResponse = await getProjects({
        status: statusFilter !== "all" ? statusFilter : undefined,
        page: currentPage,
        pageSize: itemsPerPage,
        keyword: searchQuery,
        sort_by: sortBy,
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
  }, [statusFilter, sortBy, professorFilter]);

  useEffect(() => {
    fetchProjects();
  }, [currentPage, itemsPerPage]);

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
            <p className="text-muted-foreground">Browse and manage all academic projects</p>
          </div>
          <Button onClick={() => handleOpenAddProjectDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            Add Project
          </Button>
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
          <Button
            onClick={() => {
              setCurrentPage(1);
              fetchProjects();
            }}
            className="h-10 self-center"
          >
            Search
          </Button>

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
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-1">
                  {sortBy === "lastUpdated" ? <SortDesc className="h-4 w-4" /> : <SortAsc className="h-4 w-4" />}
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortBy("lastUpdated")}>Last Updated</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("progress")}>Progress</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("deadline")}>Deadline</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link href={`/projects/${project.project_id}`} key={project.project_id} className="block">
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <StatusBadge status={project.status} />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="-mr-2 -mt-2">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            window.location.href = `/projects/${project.project_id}`;
                          }}
                        >
                          Project Details
                        </DropdownMenuItem>
                        {/* <DropdownMenuItem>Track Project</DropdownMenuItem> */}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardTitle className="line-clamp-2">{project.title}</CardTitle>
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
                      <CalendarIcon className="h-4 w-4" />
                      <span>Deadline: {formatTime(project.deadline)}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <div className="flex items-center gap-2 w-full">
                    {project.professor_user && (
                      <>
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={project.professor_user.image_url || "/placeholder.svg"}
                            alt={project.professor_user.name}
                          />
                          <AvatarFallback>{project.professor_user.name}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{project.professor_user.name}</span>
                          <span className="text-xs text-muted-foreground">Professor</span>
                        </div>
                      </>
                    )}
                    <div className="ml-auto flex items-center text-xs text-muted-foreground">
                      <Clock className="mr-1 h-3 w-3" />
                      Create At {formatTime(project.create_at)}
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>

        <Pagination
          total={totalProjectsCount}
          page={currentPage}
          pageSize={itemsPerPage}
          onPageChange={setCurrentPage}
        />
        {projects.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium">No projects found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* add project dialog */}
      <Dialog open={isAddProjectDialogOpen} onOpenChange={setIsAddProjectDialogOpen}>
        <DialogTrigger asChild>
          {/* <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Project
          </Button> */}
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
              <Input id="description" onChange={(e) => setDescription(e.target.value)} className="col-span-3" />
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
  );
}
