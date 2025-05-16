"use client";
import React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  MoreHorizontal,
  Trash2,
  PencilLine,
  Eye,
  UserPlus,
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
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
import Pagination from "./pagination";

import { getUsers } from "@/lib/apiClient";
import { User, GetUsersResponse } from "@/lib/types";

export default function UserTab() {
  const [users, setUsers] = useState<User[]>([]);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("all");
  const [currentUserPage, setCurrentUserPage] = useState(1);
  const [isDeleteUserDialogOpen, setIsDeleteUserDialogOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const userCount = 60; // Example total user count

  const [itemsPerPage] = useState(10); // 10 items per page for tables

  const handleDeleteUser = () => {
    console.log(`Deleting user with ID: ${selectedItemId}`);
    setIsDeleteUserDialogOpen(false);
    setSelectedItemId(null);
    // In a real app, this would call an API to delete the user
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response: GetUsersResponse = await getUsers({
          role: userRoleFilter !== "all" ? userRoleFilter : undefined,
          page: currentUserPage,
          pageSize: itemsPerPage,
        });
        setUsers(response.results);
        console.log("Fetched users:", response.results);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [userRoleFilter, currentUserPage, itemsPerPage]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentUserPage(1);
  }, [userSearchQuery, userRoleFilter]);

  return (
    <>
      <TabsContent value="users" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>
              View and manage all users in the system
            </CardDescription>
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
                <Select
                  value={userRoleFilter}
                  onValueChange={setUserRoleFilter}
                >
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
                {/* add user dialog */}
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
                      <DialogDescription>
                        Create a new user account in the system.
                      </DialogDescription>
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
                    <TableHead>id</TableHead>
                    <TableHead>created_at</TableHead>
                    <TableHead>lastUpdated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length > 0 ? (
                    users.map((user) => (
                      <TableRow key={user.user_id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={user.image_url || "/placeholder.svg"}
                                alt={user.name}
                                className="bg-white"
                              />
                              {/* <AvatarFallback>{user.initials}</AvatarFallback> */}
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <RoleBadge role={user.role} />
                        </TableCell>
                        <TableCell>{user.user_id}</TableCell>
                        <TableCell>{user.create_at}</TableCell>
                        <TableCell>{user.update_at}</TableCell>
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
                                <PencilLine className="mr-2 h-4 w-4" />
                                Edit User
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => {
                                  setSelectedItemId(user.user_id);
                                  setIsDeleteUserDialogOpen(true);
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
        <Pagination
          total={60}
          page={currentUserPage}
          pageSize={itemsPerPage}
          onPageChange={setCurrentUserPage}
        />
        {/* {users.length > 0 && (
          <div className="flex justify-center mt-6">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentUserPage((prev) => Math.max(prev - 1, 1))
                }
                disabled={currentUserPage === 1}
              >
                Previous
              </Button>
              <div className="flex items-center space-x-1">
                {(() => {
                  const totalPages = Math.ceil(users.length / itemsPerPage);
                  const pages = [];

                  if (totalPages <= 5) {
                    // Less than 5 pages, show all
                    for (let i = 1; i <= totalPages; i++) {
                      pages.push(
                        <Button
                          key={i}
                          variant={
                            currentUserPage === i ? "default" : "outline"
                          }
                          size="sm"
                          className="w-9"
                          onClick={() => setCurrentUserPage(i)}
                        >
                          {i}
                        </Button>
                      );
                    }
                  } else {
                    // More than 5 pages, show current page and neighbors
                    let startPage = Math.max(1, currentUserPage - 2);
                    const endPage = Math.min(totalPages, startPage + 4);

                    if (endPage - startPage < 4) {
                      startPage = Math.max(1, endPage - 4);
                    }

                    // First page
                    if (startPage > 1) {
                      pages.push(
                        <Button
                          key={1}
                          variant={
                            currentUserPage === 1 ? "default" : "outline"
                          }
                          size="sm"
                          className="w-9"
                          onClick={() => setCurrentUserPage(1)}
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
                          variant={
                            currentUserPage === i ? "default" : "outline"
                          }
                          size="sm"
                          className="w-9"
                          onClick={() => setCurrentUserPage(i)}
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
                          variant={
                            currentUserPage === totalPages
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          className="w-9"
                          onClick={() => setCurrentUserPage(totalPages)}
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
                  setCurrentUserPage((prev) =>
                    Math.min(prev + 1, Math.ceil(users.length / itemsPerPage))
                  )
                }
                disabled={
                  currentUserPage === Math.ceil(users.length / itemsPerPage)
                }
              >
                Next
              </Button>
            </div>
          </div>
        )} */}
      </TabsContent>

      <Dialog
        open={isDeleteUserDialogOpen}
        onOpenChange={setIsDeleteUserDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteUserDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
