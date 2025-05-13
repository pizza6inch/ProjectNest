"use client"

import { useState } from "react"
import Link from "next/link"
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
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for projects
const projects = [
  {
    id: "1",
    title: "Machine Learning Algorithm Comparison",
    status: "in-progress",
    deadline: "2025-06-15",
    progress: 65,
    teamLead: {
      name: "Sarah Johnson",
      avatar: "/placeholder-user.jpg",
      initials: "SJ",
    },
    team: "Data Science",
    professor: "Dr. Williams",
    lastUpdated: "2 days ago",
  },
  {
    id: "2",
    title: "Web Application Security Analysis",
    status: "pending",
    deadline: "2025-07-01",
    progress: 10,
    teamLead: {
      name: "Michael Chen",
      avatar: "/placeholder-user.jpg",
      initials: "MC",
    },
    team: "CS-101",
    professor: "Dr. Garcia",
    lastUpdated: "5 days ago",
  },
  {
    id: "3",
    title: "Database Optimization Techniques",
    status: "completed",
    deadline: "2025-05-20",
    progress: 100,
    teamLead: {
      name: "Emily Rodriguez",
      avatar: "/placeholder-user.jpg",
      initials: "ER",
    },
    team: "CS-101",
    professor: "Dr. Williams",
    lastUpdated: "1 week ago",
  },
  {
    id: "4",
    title: "Mobile App Development for Campus Services",
    status: "in-progress",
    deadline: "2025-06-30",
    progress: 45,
    teamLead: {
      name: "David Kim",
      avatar: "/placeholder-user.jpg",
      initials: "DK",
    },
    team: "CS-101",
    professor: "Dr. Garcia",
    lastUpdated: "3 days ago",
  },
  {
    id: "5",
    title: "Natural Language Processing Research",
    status: "in-progress",
    deadline: "2025-07-15",
    progress: 30,
    teamLead: {
      name: "Olivia Smith",
      avatar: "/placeholder-user.jpg",
      initials: "OS",
    },
    team: "Data Science",
    professor: "Dr. Williams",
    lastUpdated: "1 day ago",
  },
  {
    id: "6",
    title: "Cloud Infrastructure Deployment",
    status: "pending",
    deadline: "2025-08-01",
    progress: 5,
    teamLead: {
      name: "James Wilson",
      avatar: "/placeholder-user.jpg",
      initials: "JW",
    },
    team: "CS-101",
    professor: "Dr. Garcia",
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
    default:
      return <Badge>{status}</Badge>
  }
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [teamFilter, setTeamFilter] = useState("all")
  const [sortBy, setSortBy] = useState("lastUpdated")

  // Filter and sort projects
  const filteredProjects = projects
    .filter((project) => {
      const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === "all" || project.status === statusFilter
      const matchesTeam = teamFilter === "all" || project.team === teamFilter

      return matchesSearch && matchesStatus && matchesTeam
    })
    .sort((a, b) => {
      if (sortBy === "lastUpdated") {
        // Simple sort by lastUpdated (in a real app, would use actual dates)
        return a.lastUpdated.localeCompare(b.lastUpdated)
      } else if (sortBy === "progress") {
        return b.progress - a.progress
      } else if (sortBy === "deadline") {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
      }
      return 0
    })

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
            <p className="text-muted-foreground">Browse and manage all academic projects</p>
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
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
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
                    <p className="text-xs font-medium mb-1">Team</p>
                    <Select value={teamFilter} onValueChange={setTeamFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select team" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Teams</SelectItem>
                        <SelectItem value="CS-101">CS-101</SelectItem>
                        <SelectItem value="Data Science">Data Science</SelectItem>
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
          {filteredProjects.map((project) => (
            <Link href={`/projects/${project.id}`} key={project.id} className="block">
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
                        <DropdownMenuItem>Edit Project</DropdownMenuItem>
                        <DropdownMenuItem>Track Project</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardTitle className="line-clamp-2">{project.title}</CardTitle>
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
                      <span>Team: {project.team}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Deadline: {new Date(project.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <div className="flex items-center gap-2 w-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={project.teamLead.avatar || "/placeholder.svg"} alt={project.teamLead.name} />
                      <AvatarFallback>{project.teamLead.initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{project.teamLead.name}</span>
                      <span className="text-xs text-muted-foreground">Team Lead</span>
                    </div>
                    <div className="ml-auto flex items-center text-xs text-muted-foreground">
                      <Clock className="mr-1 h-3 w-3" />
                      {project.lastUpdated}
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium">No projects found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
