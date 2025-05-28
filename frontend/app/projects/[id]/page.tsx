"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock4,
  AlertCircle,
  GraduationCap,
  Paperclip,
  Send,
  ThumbsUp,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogDescription,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import StatusBadge from "@/components/status-badge";
import { createComment, getProjectDetail, getUserById, Project, ProjectDetail, updateProject } from "@/lib/apiClient";
import { User } from "@/lib/types";
import { useParams } from "next/navigation";

import { formatTime } from "@/lib/utils";

import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { error } from "console";

export default function ProjectDetailPage() {
  const params = useParams();
  const { user } = useAuth();
  const { toast } = useToast();

  const id = params.id as string;

  const [newComment, setNewComment] = useState("");
  const [activeTab, setActiveTab] = useState("updates");
  const [newUpdateContent, setNewUpdateContent] = useState("");
  const [newUpdateTitle, setNewUpdateTitle] = useState("");
  const [projectDetail, setProjectDetail] = useState<ProjectDetail>();

  const [addMemberDialog, setAddMemberDialog] = useState(false);
  const [addMemberId, setAddMemberId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // edit project form
  const [isEditProjectDialogOpen, setIsEditProjectDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [deadline, setDeadline] = useState("");
  const [progress, setProgress] = useState(0);

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

  const fetchProjectDetail = async () => {
    if (!id || typeof id !== "string") return;
    const response = await getProjectDetail({ project_id: id });
    setProjectDetail(response);
    console.log(response);
  };

  useEffect(() => {
    fetchProjectDetail();
  }, []);

  useEffect(() => {
    if (projectDetail) {
      setTitle(projectDetail.project?.title);
      setDescription(projectDetail.project?.description);
      setStatus(projectDetail.project?.status);
      setDeadline(projectDetail.project?.deadline || "");
      const members = [
        ...projectDetail.students.map((student) => ({
          id: student.user_id || "",
          data: student,
          error: null,
          loading: false,
        })),
        ...projectDetail.professors.map((professor) => ({
          id: professor.user_id || "",
          data: professor,
          error: null,
          loading: false,
        })),
      ];

      setMembers(members);
    }
  }, [projectDetail]);

  const handlePostComment = async (progressId: string) => {
    if (!user) return;

    if (isLoading) return;
    setIsLoading(true);
    try {
      await createComment({ progress: progressId, content: newComment });
      toast({
        title: "Post Comment Success",
      });
    } catch {
      toast({
        title: "Post Comment Failed",
      });
    }

    setNewComment("");
    fetchProjectDetail();
    setIsLoading(false);
  };

  const handlePostUpdate = () => {
    if (newUpdateTitle.trim() && newUpdateContent.trim()) {
      // In a real app, this would send the update to an API
      console.log(`Posting new update: ${newUpdateTitle} - ${newUpdateContent}`);
      setNewUpdateTitle("");
      setNewUpdateContent("");
    }
  };

  const handleChangeStatus = async (status: string) => {
    // In a real app, this would update the project status via an API

    if (!projectDetail?.project.title) return;

    const originalMembers = [
      ...projectDetail?.students.map((student) => student.user_id || ""),
      ...projectDetail?.professors.map((professor) => professor.user_id || ""),
    ];

    await updateProject({
      project_id: id,
      title: projectDetail?.project.title,
      description: projectDetail?.project.description,
      status: status,
      deadline: projectDetail.project.deadline,
      progress: projectDetail.project.progress,
      users: originalMembers,
    });
    fetchProjectDetail();
  };

  const checkUserIsInGroup = () => {
    if (!user) return false;
    if (user?.role === "admin") return true;
    const userInStudents = projectDetail?.students.find((student) => student.user_id === user.user_id);
    const userInProfessors = projectDetail?.professors.find((professor) => professor.user_id === user.user_id);
    return userInStudents || userInProfessors;
  };

  const handleAddMember = async () => {
    setIsLoading(true);
    if (!checkUserIsInGroup()) {
      toast({
        title: "Add Member Error",
        description: "You must in projects to add members",
      });
      setIsLoading(false);
      return;
    }

    if (!projectDetail?.project.title) return;

    const originalMembers = [
      ...projectDetail?.students.map((student) => student.user_id || ""),
      ...projectDetail?.professors.map((professor) => professor.user_id || ""),
    ];
    console.log(addMemberId);

    try {
      const user = await getUserById(addMemberId);

      await updateProject({
        project_id: id,
        title: projectDetail?.project.title,
        description: projectDetail?.project.description,
        status: projectDetail.project.status,
        deadline: projectDetail.project.deadline,
        progress: projectDetail.project.progress,
        users: [...originalMembers, addMemberId],
      });
      setIsLoading(false);
      fetchProjectDetail();
      setAddMemberId("");
      setAddMemberDialog(false);
      toast({
        title: "Add Member Success",
      });
      fetchProjectDetail();
    } catch {
      toast({
        title: "Add Member Error",
        description: "Please check userId",
      });
      setIsLoading(false);
      return;
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
        project_id: id,
        title,
        description,
        status,
        deadline,
        progress,
        users: members.map((m) => m.data?.user_id || ""),
      });

      toast({ title: "Edit Project Success" });
      setIsEditProjectDialogOpen(false);

      fetchProjectDetail();
    } catch (err) {
      toast({ title: "Edit Project Error", description: `${err}` });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">{projectDetail?.project.title}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Project details sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-1">Status</h3>
                  <div className="flex items-center justify-between">
                    <StatusBadge status={projectDetail?.project.status || ""} />
                    <Select
                      disabled={!checkUserIsInGroup()}
                      defaultValue={projectDetail?.project.status}
                      onValueChange={handleChangeStatus}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Change status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-1">Progress</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Overall Completion</span>
                      <span>{projectDetail?.project.progress}%</span>
                    </div>
                    <Progress value={projectDetail?.project.progress} className="h-2" />
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-1">Deadline</h3>
                  <div className="flex items-center gap-2 text-sm">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    {projectDetail?.project.deadline && <span>{formatTime(projectDetail?.project.deadline)}</span>}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-medium mb-2">Professor</h3>
                  <div className="space-y-2">
                    {projectDetail?.professors.map((professor) => (
                      <div className="flex items-center gap-2" key={professor.user_id}>
                        <GraduationCap className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm">{professor.name}</span>
                        <span className="text-xs text-muted-foreground">{professor.email}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-medium mb-2">Project Members</h3>
                  <div className="space-y-2">
                    {projectDetail?.students.map((student) => (
                      <div key={student.user_id} className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={student.image_url} alt={student.name} />
                          <AvatarFallback>{student.name}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{student.name}</p>
                          <p className="text-xs text-muted-foreground">{"student"}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <Button className="w-full" onClick={() => setAddMemberDialog(true)} disabled={!checkUserIsInGroup()}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Member
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" variant="outline" onClick={() => setIsEditProjectDialogOpen(true)}>
                  Edit Project Detail
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main content area */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{projectDetail?.project.description}</p>
              </CardContent>
            </Card>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="updates">Updates</TabsTrigger>
                <TabsTrigger value="post">Post Update</TabsTrigger>
              </TabsList>

              <TabsContent value="updates" className="space-y-4 pt-4">
                {projectDetail?.progresses.map((progress) => (
                  <Card key={progress.progress_id} className="mb-6">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={progress.author.image_url || "/placeholder.svg"}
                              alt={progress.author.name}
                            />
                            <AvatarFallback>{progress.author.name}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{progress.author.name}</p>
                            <p className="text-xs text-muted-foreground">{formatTime(progress.create_at || "")}</p>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit Update</DropdownMenuItem>
                            <DropdownMenuItem>Delete Update</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <CardTitle className="text-lg">{progress.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="whitespace-pre-line">{progress.progress_note}</p>

                      {/* {update.attachments.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium mb-2">Attachments</h4>
                          <div className="space-y-2">
                            {update.attachments.map((attachment) => (
                              <div key={attachment.name} className="flex items-center gap-2 p-2 rounded-md bg-muted">
                                <Paperclip className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{attachment.name}</span>
                                <span className="text-xs text-muted-foreground ml-auto">{attachment.size}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )} */}
                    </CardContent>
                    <CardFooter className="flex-col items-start pt-2">
                      <div className="flex items-center gap-4 w-full pb-2">
                        <Button variant="ghost" size="sm" className="gap-1">
                          <MessageSquare className="h-4 w-4" />
                          Comment ({progress.comments.length})
                        </Button>
                      </div>

                      {progress.comments.length > 0 && (
                        <div className="w-full border-t pt-2 space-y-3">
                          {progress.comments.map((comment) => (
                            <div key={comment.comment_id} className="flex gap-2">
                              <Avatar className="h-7 w-7">
                                <AvatarImage
                                  src={comment.author.image_url || "/placeholder.svg"}
                                  alt={comment.author.name}
                                />
                                <AvatarFallback>{comment.author.name}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="bg-muted p-2 rounded-md">
                                  <div className="flex justify-between items-center mb-1">
                                    <p className="text-xs font-medium">{comment.author.name}</p>
                                    <p className="text-xs text-muted-foreground">{formatTime(comment.create_at)}</p>
                                  </div>
                                  <p className="text-sm">{comment.content}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-2 w-full mt-3">
                        <Avatar className="h-7 w-7">
                          <AvatarImage src={user?.image_url} alt="Your Avatar" />
                          <AvatarFallback>YA</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 flex gap-2">
                          <Textarea
                            placeholder="Add a comment..."
                            className="min-h-[40px] flex-1"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                          />
                          <Button
                            size="icon"
                            onClick={() => handlePostComment(progress.progress_id)}
                            disabled={!newComment.trim()}
                          >
                            <Send className="h-4 w-4" />
                            <span className="sr-only">Send</span>
                          </Button>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="post" className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Post a New Update</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="update-title" className="text-sm font-medium">
                        Title
                      </label>
                      <input
                        id="update-title"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Enter update title"
                        value={newUpdateTitle}
                        onChange={(e) => setNewUpdateTitle(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="update-content" className="text-sm font-medium">
                        Content
                      </label>
                      <Textarea
                        id="update-content"
                        placeholder="Describe your progress update..."
                        className="min-h-[200px]"
                        value={newUpdateContent}
                        onChange={(e) => setNewUpdateContent(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Attachments</label>
                      <div className="flex items-center justify-center border border-dashed border-input rounded-md p-6">
                        <div className="flex flex-col items-center gap-1 text-center">
                          <Paperclip className="h-8 w-8 text-muted-foreground" />
                          <p className="text-sm font-medium">Drag files here or click to upload</p>
                          <p className="text-xs text-muted-foreground">
                            Upload any relevant files (PDF, DOC, images, etc.)
                          </p>
                          <Button variant="outline" size="sm" className="mt-2">
                            Select Files
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handlePostUpdate} disabled={!newUpdateTitle.trim() || !newUpdateContent.trim()}>
                      Post Update
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* addMemberDialog */}
      <Dialog open={addMemberDialog} onOpenChange={setAddMemberDialog}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Student/Professor</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Members input with preview */}
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="col-span-3 space-y-4">
                <div className="border rounded p-3">
                  <Input
                    placeholder="Enter user ID"
                    value={addMemberId}
                    onChange={(e) => setAddMemberId(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            {isLoading ? (
              <Button disabled>
                <Loader2 className="animate-spin" />
                Adding..
              </Button>
            ) : (
              <Button onClick={() => handleAddMember()} type="submit">
                Add Member
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* edit project dialog */}
      <Dialog open={isEditProjectDialogOpen} onOpenChange={setIsEditProjectDialogOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Edit Project {projectDetail?.project?.title}(project_id:
              {projectDetail?.project.project_id}) in the system.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="project_id" className="text-right">
                ProjectTitle
              </Label>
              <Input id="project_id" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Description
              </Label>
              <Input
                id="name"
                value={description}
                className="col-span-3"
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Status
              </Label>
              <Select value={status} onValueChange={(value) => setStatus(value)}>
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
                        placeholder="user ID"
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
    </div>
  );
}
