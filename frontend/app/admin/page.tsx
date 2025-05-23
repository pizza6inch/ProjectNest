"use client";

import { useState } from "react";
import { Shield } from "lucide-react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import React from "react";

import OverviewTab from "@/components/overview-tab";
import UserTab from "@/components/user-tab";
import ProjectTab from "@/components/project-tab";

import { DashboardStatsProvider } from "@/hooks/dashBoardStatsContext";

import { useAuth } from "@/hooks/useAuth"; // Custom hook to manage authentication

// Role badge component

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");

  const { user } = useAuth();

  if (user?.role !== "admin") {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">Access Denied</h1>
      </div>
    );
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
            <p className="text-muted-foreground">
              Manage users, projects, and system settings
            </p>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
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
            <ProjectTab />
          </DashboardStatsProvider>
        </Tabs>
      </div>
    </div>
  );
}
