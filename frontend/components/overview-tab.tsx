"use client";
import React, { useEffect, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TabsContent } from "@/components/ui/tabs";
import RoleBadge from "@/components/role-badge";
import StatusBadge from "@/components/status-badge";
import { Users, FolderKanban, BarChart3, CheckCircle2 } from "lucide-react";

import { getUsers } from "@/lib/apiClient";
import { User } from "@/lib/types";

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

export default function OverviewTab({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const [users, setUsers] = useState<User[]>([]);

  const { userCount, projectCount, completedProjects, activeProjects, setStats } = useDashboardStats();
  // const [projects, setProjects] = useState(projects);

  // get users data from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsers({
          // role: "admin",
          sort_by: "created_at",
          page: 1,
          pageSize: 10,
        });
        setUsers(response.results);
        // console.log("Fetched users:", response.results);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Stats for overview
  const stats = [
    {
      title: "Total Users",
      value: 778899,
      icon: Users,
      change: "+2 this month",
      trend: "up",
    },
    {
      title: "Active Projects",
      //   value: projects.filter((p) => p.status !== "completed").length,
      value: 778899,
      icon: FolderKanban,
      change: "+1 this week",
      trend: "up",
    },
    {
      title: "Completed Projects",
      // value: projects.filter((p) => p.status === "completed").length,
      value: 778899,
      icon: CheckCircle2,
      change: "No change",
      trend: "neutral",
    },
    {
      title: "System Online Duration",
      value: "10 days",
      icon: BarChart3,
      change: "+2% from last week",
      trend: "up",
    },
  ];
  {
    /* Overview Tab */
  }
  return (
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
              {users.length > 0 &&
                users.map((user) => (
                  <div key={user.user_id} className="flex items-center gap-4">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.image_url || "/placeholder.svg"} alt={user.name} />
                      {/* <AvatarFallback>{user.initials}</AvatarFallback> */}
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
  );
}
