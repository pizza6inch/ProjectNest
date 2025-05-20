"use client";
import React, { FormEvent } from "react";
import { useState, useEffect } from "react";

import { Search, MoreHorizontal, Trash2, PencilLine, UserPlus, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

import { Input } from "@/components/ui/input";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
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

import RoleBadge from "@/components/role-badge";
import Pagination from "./pagination";

import { getUsers, createUser, updateUser, deleteUser } from "@/lib/apiClient";
import { User, GetUsersResponse } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useDashboardStats } from "@/hooks/userContext";

export default function UserTab() {
  const [users, setUsers] = useState<User[]>([]);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("all");
  const [currentUserPage, setCurrentUserPage] = useState(1);
  const [isDeleteUserDialogOpen, setIsDeleteUserDialogOpen] = useState(false);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();

  const { setStats } = useDashboardStats();

  // add/edit user form
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  // const userCount = 60; // Example total user count

  const [itemsPerPage] = useState(10); // 10 items per page for tables

  const fetchUsers = async () => {
    try {
      const response: GetUsersResponse = await getUsers({
        role: userRoleFilter !== "all" ? userRoleFilter : undefined,
        page: currentUserPage,
        pageSize: itemsPerPage,
      });

      setUsers(response.results);
      setStats({ userCount: response.total });
      console.log("Fetched users:", response.results);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleAddUser = async () => {
    if (!userId || !name || !email || !password || !role) {
      toast({ title: "Add User Error", description: "All fields are required" });
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast({ title: "Add User Error", description: "Invalid email format" });
      return;
    }

    try {
      setIsLoading(true);

      await createUser({ user_id: userId, name, email, password, role });

      setIsAddUserDialogOpen(false);
      toast({ title: "Add User Success" });
      fetchUsers();
    } catch (err) {
      toast({ title: "Add User Error", description: `${err}` });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditUser = async () => {
    if (!userId || !name || !email || !password || !role) {
      toast({ title: "Edit User Error", description: "All fields are required" });
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast({ title: "Edit User Error", description: "Invalid email format" });
      return;
    }

    try {
      setIsLoading(true);

      await updateUser({ user_id: userId, name, email, password, role });

      toast({ title: "Edit User Success" });
      setIsEditUserDialogOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (err) {
      toast({ title: "Edit User Error", description: `${err}` });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    console.log(`Deleting user with ID: ${selectedUser?.user_id}`);

    if (!selectedUser) return;

    try {
      setIsLoading(true);

      await deleteUser(selectedUser?.user_id);

      toast({ title: "Delete User Success" });
      setIsDeleteUserDialogOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (err) {
      toast({ title: "Delete User Error", description: `${err}` });
    } finally {
      setIsLoading(false);
    }

    setIsDeleteUserDialogOpen(false);
    setSelectedUser(null);
    // In a real app, this would call an API to delete the user
  };

  useEffect(() => {
    setUserId("");
    setName("");
    setEmail("");
    setRole("");
    setPassword("");
  }, [isAddUserDialogOpen]);

  useEffect(() => {
    if (selectedUser) {
      setUserId(selectedUser?.user_id);
      setName(selectedUser?.name);
      setEmail(selectedUser?.email);
      setRole(selectedUser?.role);
      setPassword("");
    }
  }, [selectedUser]);

  useEffect(() => {
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
                    {/* <SelectItem value="admin">Admin</SelectItem> */}
                    <SelectItem value="professor">Professor</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                  </SelectContent>
                </Select>
                {/* add user dialog */}
                <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
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
                        <Label htmlFor="user_id" className="text-right">
                          Student_ID
                        </Label>
                        <Input id="user_id" onChange={(e) => setUserId(e.target.value)} className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Name
                        </Label>
                        <Input id="name" className="col-span-3" onChange={(e) => setName(e.target.value)} />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
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
                          Creating...
                        </Button>
                      ) : (
                        <Button onClick={handleAddUser} type="submit">
                          Create User
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
                              <div className="text-xs text-muted-foreground">{user.email}</div>
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
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedUser(user);
                                  setIsEditUserDialogOpen(true);
                                }}
                              >
                                <PencilLine className="mr-2 h-4 w-4" />
                                Edit User
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => {
                                  setSelectedUser(user);
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
        <Pagination total={60} page={currentUserPage} pageSize={itemsPerPage} onPageChange={setCurrentUserPage} />
      </TabsContent>

      {/* edit user dialog */}
      <Dialog open={isEditUserDialogOpen} onOpenChange={setIsEditUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Edit User {selectedUser?.name}(user_id:{selectedUser?.user_id}) in the system.
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
              <Select value={role} onValueChange={(value) => setRole(value)}>
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

      {/* delete user dialog */}
      <Dialog open={isDeleteUserDialogOpen} onOpenChange={setIsDeleteUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user(user_id:{selectedUser?.user_id})? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteUserDialogOpen(false)}>
              Cancel
            </Button>
            {isLoading ? (
              <Button disabled>
                <Loader2 className="animate-spin" />
                Deleting...
              </Button>
            ) : (
              <Button variant="destructive" onClick={handleDeleteUser}>
                Delete
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
