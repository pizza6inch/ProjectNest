"use client";

import Link from "next/link";
import {
  Bell,
  CheckCircle2,
  Clock4,
  AlertCircle,
  User as UserIcon,
  Bookmark,
  BookmarkPlus,
  MoreHorizontal,
  Settings,
  FileEdit,
  LogOut,
  Loader2,
  Calendar as CalendarIcon,
  Clock,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { useAuth } from "../../hooks/useAuth";
import { getUserById, Project, updateUser, getMyProjects, createProject } from "@/lib/apiClient";
import { useEffect, useState } from "react";
import { User } from "@/lib/types";

import { useToast } from "@/hooks/use-toast";
import { formatTime } from "@/lib/utils";

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [isAddProjectDialogOpen, setIsAddProjectDialogOpen] = useState(false);

  const [userData, setUserData] = useState<User>();

  const [myProjects, setMyProjects] = useState<Project[]>([]);

  // edit form
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  // add project form
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [deadline, setDeadline] = useState("");

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

  const getUserData = async () => {
    if (!user) return;
    if (!user.user_id) return;
    const userData = await getUserById(user.user_id);
    setUserData(userData);
  };

  const fetchMyProjects = async () => {
    if (!user) return;
    if (!user.user_id) return;
    const myProjects = await getMyProjects({ user_id: user.user_id });
    setMyProjects(myProjects);
  };

  useEffect(() => {
    getUserData();
  }, [user]);

  useEffect(() => {
    if (userData) {
      setUserId(userData?.user_id || "");
      setName(userData?.name || "");
      setEmail(userData?.email || "");
      setRole(userData?.role || "");
      setPassword("");
    }
  }, [userData]);

  useEffect(() => {
    fetchMyProjects();
  }, [user]);

  const handleEditUser = async () => {
    if (!userId || !name || !email || !password || !role || !userData?.user_id) {
      toast({
        title: "Edit Profile Error",
        description: "All fields are required",
      });
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast({ title: "Edit Profile Error", description: "Invalid email format" });
      return;
    }

    try {
      setIsLoading(true);

      await updateUser(userData?.user_id, { user_id: userId, name, email, password, role });

      toast({ title: "Edit Profile Success" });
      setIsEditUserDialogOpen(false);
      getUserData();
    } catch (err) {
      toast({ title: "Edit Profile Error", description: `${err}` });
    } finally {
      setIsLoading(false);
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
      fetchMyProjects();
    } catch (err) {
      toast({ title: "Add Project Error", description: `${err}` });
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please log in to access the dashboard.</div>;
  }

  const trackedProjects = [
    {
      id: "2",
      title: "Web Application Security Analysis",
      status: "pending",
      deadline: "2025-07-01",
      progress: 10,
      professor: "Dr. Garcia",
      lastActivity: "Michael added team members 5 days ago",
    },
    {
      id: "3",
      title: "Database Optimization Techniques",
      status: "completed",
      deadline: "2025-05-20",
      progress: 100,
      professor: "Dr. Williams",
      lastActivity: "Project completed 1 week ago",
    },
    {
      id: "5",
      title: "Natural Language Processing Research",
      status: "in-progress",
      deadline: "2025-07-15",
      progress: 30,
      professor: "Dr. Williams",
      lastActivity: "Olivia posted an update 1 day ago",
    },
  ];

  // Recent activity
  const recentActivity = [
    {
      id: "a1",
      type: "update",
      project: "Machine Learning Algorithm Comparison",
      user: "Sarah Johnson",
      action: "posted an update",
      time: "2 days ago",
    },
    {
      id: "a2",
      type: "comment",
      project: "Natural Language Processing Research",
      user: "Dr. Williams",
      action: "commented on an update",
      time: "1 day ago",
    },
    {
      id: "a3",
      type: "status",
      project: "Database Optimization Techniques",
      user: "Emily Rodriguez",
      action: "marked the project as completed",
      time: "1 week ago",
    },
    {
      id: "a4",
      type: "member",
      project: "Web Application Security Analysis",
      user: "Michael Chen",
      action: "added new members",
      time: "5 days ago",
    },
    {
      id: "a5",
      type: "file",
      project: "Mobile App Development for Campus Services",
      user: "David Kim",
      action: "uploaded new files",
      time: "3 days ago",
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
      default:
        return <Badge>{status}</Badge>;
    }
  }

  // Project card component
  function ProjectCard({ project }: { project: Project }) {
    return (
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
                <UserIcon className="h-4 w-4" />
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
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {userData && userData.name}</p>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <UserIcon className="h-4 w-4" />
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => {
                    setIsEditUserDialogOpen(true);
                  }}
                >
                  <FileEdit className="mr-2 h-4 w-4" />
                  <span>Edit Profile</span>
                </DropdownMenuItem>
                <Separator className="my-1" />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {userData && (
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Profile</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={userData.image_url || "/placeholder.svg"} alt={userData.name} />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold">{userData.name}</h2>
                <p className="text-sm text-muted-foreground">{userData.email}</p>
                <Badge className="mt-2">{userData.role}</Badge>

                <div className="w-full mt-6 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>StudentID:</span>
                    <span className="font-medium">{userData.user_id}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Joined:</span>
                    <span className="font-medium">{userData.create_at && formatTime(userData.create_at)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Update At:</span>
                    <span className="font-medium">{userData.update_at && formatTime(userData.update_at)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Projects:</span>
                    <span className="font-medium">{myProjects.length}</span>
                  </div>
                  {/* <div className="flex justify-between text-sm">
                  <span>Tracked:</span>
                  <span className="font-medium">{trackedProjects.length}</span>
                </div> */}
                </div>

                <Button
                  className="mt-6 w-full"
                  variant="outline"
                  onClick={() => {
                    setIsEditUserDialogOpen(true);
                  }}
                >
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
          )}

          {/* <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="mt-0.5">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {activity.user
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">{activity.user}</span> {activity.action} in{" "}
                        <Link href="#" className="font-medium hover:underline">
                          {activity.project}
                        </Link>
                      </p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button variant="ghost" className="w-full text-sm">
                View All Activity
              </Button>
            </CardFooter>
          </Card> */}
        </div>

        <Tabs defaultValue="my-projects">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="my-projects">My Projects</TabsTrigger>
              {/* <TabsTrigger value="tracked-projects">Tracked Projects</TabsTrigger> */}
            </TabsList>
            {/* <Button size="sm">
              <BookmarkPlus className="mr-2 h-4 w-4" />
              Track New Project
            </Button> */}
          </div>

          <TabsContent value="my-projects" className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myProjects.map((project) => (
                <ProjectCard key={project.project_id} project={project} />
              ))}
            </div>
            {myProjects.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Bookmark className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No projects yet</h3>
                  <p className="text-sm text-muted-foreground text-center mt-1">
                    You don't have any projects assigned to you yet.
                  </p>
                  <Button
                    className="mt-4"
                    onClick={() => {
                      setIsAddProjectDialogOpen(true);
                    }}
                  >
                    Create New Project
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* <TabsContent value="tracked-projects" className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trackedProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
            {trackedProjects.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Bookmark className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No tracked projects</h3>
                  <p className="text-sm text-muted-foreground text-center mt-1">
                    You haven't tracked any projects yet.
                  </p>
                  <Button className="mt-4">Track a Project</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent> */}
        </Tabs>
      </div>

      {/* edit user dialog */}
      <Dialog open={isEditUserDialogOpen} onOpenChange={setIsEditUserDialogOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Edit User {userData?.name}(user_id:{userData?.user_id}) in the system.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="user_id" className="text-right">
                Student_ID
              </Label>
              <Input id="user_id" value={userId} onChange={(e) => setUserId(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" value={name} className="col-span-3" onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                value={email}
                type="email"
                className="col-span-3"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Password
              </Label>
              <Input id="password" className="col-span-3" onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Select onValueChange={(value) => setRole(value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {/* <SelectItem value="admin">Admin</SelectItem> */}
                  <SelectItem value="professor">Professor</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
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
              <Button onClick={handleEditUser} type="submit">
                Save Changes
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* add project dialog */}
      <Dialog open={isAddProjectDialogOpen} onOpenChange={setIsAddProjectDialogOpen}>
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
                        placeholder="enter ID"
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
                      <div className=" p-2 rounded flex items-center gap-2 text-sm">
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
