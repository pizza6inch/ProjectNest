"use client"

import { useState } from "react"
import Link from "next/link"
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
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

import { useAuth } from "../../hooks/useAuth"


// Mock data for users
const users = [
  {
    id: "u1",
    name: "Sarah Johnson",
    email: "sarah.johnson@university.edu",
    role: "student",
    avatar: "/placeholder-user.jpg",
    initials: "SJ",
    department: "Computer Science",
    projectCount: 3,
    status: "active",
    lastActive: "2 hours ago",
  },
  {
    id: "u2",
    name: "Michael Chen",
    email: "michael.chen@university.edu",
    role: "student",
    avatar: "/placeholder-user.jpg",
    initials: "MC",
    department: "Computer Science",
    projectCount: 2,
    status: "active",
    lastActive: "1 day ago",
  },
  {
    id: "u3",
    name: "Dr. Williams",
    email: "dr.williams@university.edu",
    role: "professor",
    avatar: "/placeholder-user.jpg",
    initials: "DW",
    department: "Computer Science",
    projectCount: 5,
    status: "active",
    lastActive: "3 hours ago",
  },
  {
    id: "u4",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@university.edu",
    role: "student",
    avatar: "/placeholder-user.jpg",
    initials: "ER",
    department: "Computer Science",
    projectCount: 1,
    status: "inactive",
    lastActive: "2 weeks ago",
  },
  {
    id: "u5",
    name: "Dr. Garcia",
    email: "dr.garcia@university.edu",
    role: "professor",
    avatar: "/placeholder-user.jpg",
    initials: "DG",
    department: "Computer Science",
    projectCount: 4,
    status: "active",
    lastActive: "5 hours ago",
  },
  {
    id: "u6",
    name: "John Doe",
    email: "john.doe@university.edu",
    role: "admin",
    avatar: "/placeholder-user.jpg",
    initials: "JD",
    department: "Administration",
    projectCount: 0,
    status: "active",
    lastActive: "Just now",
  },
]

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
    case "active":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          <CheckCircle2 className="mr-1 h-3 w-3" />
          Active
        </Badge>
      )
    case "inactive":
      return (
        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
          <AlertCircle className="mr-1 h-3 w-3" />
          Inactive
        </Badge>
      )
    default:
      return <Badge>{status}</Badge>
  }
}

// Role badge component
function RoleBadge({ role }: { role: string }) {
  switch (role) {
    case "admin":
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
          <Shield className="mr-1 h-3 w-3" />
          Admin
        </Badge>
      )
    case "professor":
      return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Professor</Badge>
    case "student":
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Student</Badge>
    default:
      return <Badge>{role}</Badge>
  }
}

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [userSearchQuery, setUserSearchQuery] = useState("")
  const [userRoleFilter, setUserRoleFilter] = useState("all")
  const [projectSearchQuery, setProjectSearchQuery] = useState("")
  const [projectStatusFilter, setProjectStatusFilter] = useState("all")
  const [isDeleteUserDialogOpen, setIsDeleteUserDialogOpen] = useState(false)
  const [isDeleteProjectDialogOpen, setIsDeleteProjectDialogOpen] = useState(false)
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)

  const {user,loading} = useAuth()

  if(loading){
    return <div>Loading...</div>
  }

  if(!user || user.role!="admin"){
    return <div>Unauthorized access. Please log in as admin</div>
  }


  // Filter users based on search and role filter
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearchQuery.toLowerCase())
    const matchesRole = userRoleFilter === "all" || user.role === userRoleFilter
    return matchesSearch && matchesRole
  })

  // Filter projects based on search and status filter
  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(projectSearchQuery.toLowerCase())
    const matchesStatus = projectStatusFilter === "all" || project.status === projectStatusFilter
    return matchesSearch && matchesStatus
  })

  // Stats for overview
  const stats = [
    {
      title: "Total Users",
      value: users.length,
      icon: Users,
      change: "+2 this month",
      trend: "up",
    },
    {
      title: "Active Projects",
      value: projects.filter((p) => p.status !== "completed").length,
      icon: FolderKanban,
      change: "+1 this week",
      trend: "up",
    },
    {
      title: "Completed Projects",
      value: projects.filter((p) => p.status === "completed").length,
      icon: CheckCircle2,
      change: "No change",
      trend: "neutral",
    },
    {
      title: "System Health",
      value: "98%",
      icon: BarChart3,
      change: "+2% from last week",
      trend: "up",
    },
  ]

  // Handle delete user
  const handleDeleteUser = () => {
    console.log(`Deleting user with ID: ${selectedItemId}`)
    setIsDeleteUserDialogOpen(false)
    setSelectedItemId(null)
    // In a real app, this would call an API to delete the user
  }

  // Handle delete project
  const handleDeleteProject = () => {
    console.log(`Deleting project with ID: ${selectedItemId}`)
    setIsDeleteProjectDialogOpen(false)
    setSelectedItemId(null)
    // In a real app, this would call an API to delete the project
  }

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

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, i) => (
                <Card key={i}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    <stat.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">{stat.change}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Recent Users</CardTitle>
                  <CardDescription>Recently active users in the system</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {users.slice(0, 5).map((user) => (
                      <div key={user.id} className="flex items-center gap-4">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                          <AvatarFallback>{user.initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                        <RoleBadge role={user.role} />
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => setActiveTab("users")}>
                    View All Users
                  </Button>
                </CardFooter>
              </Card>

              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Recent Projects</CardTitle>
                  <CardDescription>Recently updated projects</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {projects.slice(0, 5).map((project) => (
                      <div key={project.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{project.title}</p>
                          <StatusBadge status={project.status} />
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <span>Progress: {project.progress}%</span>
                          <span className="ml-auto">{project.lastUpdated}</span>
                        </div>
                        <Progress value={project.progress} className="h-1" />
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => setActiveTab("projects")}>
                    View All Projects
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>View and manage all users in the system</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search users by name or email..."
                      className="w-full pl-8"
                      value={userSearchQuery}
                      onChange={(e) => setUserSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Select value={userRoleFilter} onValueChange={setUserRoleFilter}>
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Filter by role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="professor">Professor</SelectItem>
                        <SelectItem value="student">Student</SelectItem>
                      </SelectContent>
                    </Select>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>
                          <UserPlus className="mr-2 h-4 w-4" />
                          Add User
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add New User</DialogTitle>
                          <DialogDescription>Create a new user account in the system.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                              Name
                            </Label>
                            <Input id="name" className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                              Email
                            </Label>
                            <Input id="email" type="email" className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="role" className="text-right">
                              Role
                            </Label>
                            <Select>
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="professor">Professor</SelectItem>
                                <SelectItem value="student">Student</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="department" className="text-right">
                              Department
                            </Label>
                            <Input id="department" className="col-span-3" />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit">Create User</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Projects</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                                  <AvatarFallback>{user.initials}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{user.name}</div>
                                  <div className="text-xs text-muted-foreground">{user.email}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <RoleBadge role={user.role} />
                            </TableCell>
                            <TableCell>{user.department}</TableCell>
                            <TableCell>{user.projectCount}</TableCell>
                            <TableCell>
                              <StatusBadge status={user.status} />
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
                                  <DropdownMenuItem>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Profile
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <PencilLine className="mr-2 h-4 w-4" />
                                    Edit User
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={() => {
                                      setSelectedItemId(user.id)
                                      setIsDeleteUserDialogOpen(true)
                                    }}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete User
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center">
                            No users found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

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
                        filteredProjects.map((project) => (
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
                                      setSelectedItemId(project.id)
                                      setIsDeleteProjectDialogOpen(true)
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
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete User Confirmation Dialog */}
      <Dialog open={isDeleteUserDialogOpen} onOpenChange={setIsDeleteUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteUserDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
  )
}
