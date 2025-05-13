"use client"

import Link from "next/link"
import {
  Bell,
  Calendar,
  CheckCircle2,
  Clock4,
  AlertCircle,
  User,
  Bookmark,
  BookmarkPlus,
  MoreHorizontal,
  Settings,
  FileEdit,
  LogOut,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock user data
const user = {
  name: "John Doe",
  email: "john.doe@university.edu",
  role: "Professor",
  avatar: "/placeholder-user.jpg",
  department: "Computer Science",
  joinDate: "2023-01-15",
}

// Mock projects data
const myProjects = [
  {
    id: "1",
    title: "Machine Learning Algorithm Comparison",
    status: "in-progress",
    deadline: "2025-06-15",
    progress: 65,
    professor: "Dr. Williams",
    lastActivity: "Sarah posted an update 2 days ago",
  },
  {
    id: "4",
    title: "Mobile App Development for Campus Services",
    status: "in-progress",
    deadline: "2025-06-30",
    progress: 45,
    professor: "Dr. Garcia",
    lastActivity: "David uploaded new files 3 days ago",
  },
  {
    id: "6",
    title: "Cloud Infrastructure Deployment",
    status: "pending",
    deadline: "2025-08-01",
    progress: 5,
    professor: "Dr. Garcia",
    lastActivity: "Project created 1 week ago",
  },
]

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
]

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
]

// Status badge component
function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "completed":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          <CheckCircle2 className="mr-1 h-3 w-3" />
          Completed
        </Badge>
      )
    case "in-progress":
      return (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          <Clock4 className="mr-1 h-3 w-3" />
          In Progress
        </Badge>
      )
    case "pending":
      return (
        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
          <AlertCircle className="mr-1 h-3 w-3" />
          Pending
        </Badge>
      )
    default:
      return <Badge>{status}</Badge>
  }
}

// Project card component
function ProjectCard({ project }: { project: any }) {
  return (
    <Card className="h-full">
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
              <DropdownMenuItem asChild>
                <Link href={`/projects/${project.id}`}>View Project</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Untrack Project</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Link href={`/projects/${project.id}`} className="hover:underline">
          <CardTitle className="text-lg line-clamp-1">{project.title}</CardTitle>
        </Link>
        <CardDescription className="line-clamp-1">Professor: {project.professor}</CardDescription>
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
            <Calendar className="h-4 w-4" />
            <span>Deadline: {new Date(project.deadline).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 text-xs text-muted-foreground border-t">{project.lastActivity}</CardFooter>
    </Card>
  )
}

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user.name}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Notifications</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <User className="h-4 w-4" />
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FileEdit className="mr-2 h-4 w-4" />
                  <span>Edit Profile</span>
                </DropdownMenuItem>
                <Separator className="my-1" />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <Badge className="mt-2">{user.role}</Badge>

              <div className="w-full mt-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Department:</span>
                  <span className="font-medium">{user.department}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Joined:</span>
                  <span className="font-medium">{new Date(user.joinDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Projects:</span>
                  <span className="font-medium">{myProjects.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tracked:</span>
                  <span className="font-medium">{trackedProjects.length}</span>
                </div>
              </div>

              <Button className="mt-6 w-full" variant="outline">
                Edit Profile
              </Button>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
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
          </Card>
        </div>

        <Tabs defaultValue="my-projects">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="my-projects">My Projects</TabsTrigger>
              <TabsTrigger value="tracked-projects">Tracked Projects</TabsTrigger>
            </TabsList>
            <Button size="sm">
              <BookmarkPlus className="mr-2 h-4 w-4" />
              Track New Project
            </Button>
          </div>

          <TabsContent value="my-projects" className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
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
                  <Button className="mt-4">Create New Project</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="tracked-projects" className="pt-4">
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
