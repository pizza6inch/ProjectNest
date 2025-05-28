"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import StatusBadge from "@/components/status-badge";
import { getProjectDetail, Project, ProjectDetail } from "@/lib/apiClient";
import { useParams } from "next/navigation";

// Mock project data
const project = {
  id: "1",
  title: "Machine Learning Algorithm Comparison",
  description:
    "This project aims to compare the performance of various machine learning algorithms on different datasets. The goal is to identify which algorithms perform best under specific conditions and data characteristics.",
  status: "in-progress",
  deadline: "2025-06-15",
  progress: 65,
  teamLead: {
    name: "Sarah Johnson",
    avatar: "/placeholder-user.jpg",
    initials: "SJ",
    role: "Student",
  },
  professor: "Dr. Williams",
  members: [
    {
      name: "Sarah Johnson",
      avatar: "/placeholder-user.jpg",
      initials: "SJ",
      role: "Project Lead",
    },
    {
      name: "Alex Thompson",
      avatar: "/placeholder-user.jpg",
      initials: "AT",
      role: "Student",
    },
    {
      name: "Maya Patel",
      avatar: "/placeholder-user.jpg",
      initials: "MP",
      role: "Student",
    },
    {
      name: "Jason Lee",
      avatar: "/placeholder-user.jpg",
      initials: "JL",
      role: "Student",
    },
  ],
  updates: [
    {
      id: "u1",
      title: "Initial Research Completed",
      content:
        "We've completed the initial research phase. We've identified 5 key algorithms to compare: Random Forest, SVM, Neural Networks, Gradient Boosting, and K-Nearest Neighbors.",
      date: "2025-05-01",
      author: {
        name: "Sarah Johnson",
        avatar: "/placeholder-user.jpg",
        initials: "SJ",
      },
      attachments: [{ name: "research-summary.pdf", size: "2.4 MB" }],
      likes: 3,
      comments: [
        {
          id: "c1",
          content: "Great work! Have you considered including decision trees as well?",
          date: "2025-05-01",
          author: {
            name: "Dr. Williams",
            avatar: "/placeholder-user.jpg",
            initials: "DW",
            role: "Professor",
          },
        },
        {
          id: "c2",
          content: "Yes, we'll include decision trees in our comparison as well. Thanks for the suggestion!",
          date: "2025-05-02",
          author: {
            name: "Sarah Johnson",
            avatar: "/placeholder-user.jpg",
            initials: "SJ",
          },
        },
      ],
    },
    {
      id: "u2",
      title: "Dataset Selection",
      content:
        "We've selected 3 datasets for our comparison: UCI Machine Learning Repository's Iris dataset, MNIST handwritten digits, and a custom dataset we've created for text classification.",
      date: "2025-05-10",
      author: {
        name: "Maya Patel",
        avatar: "/placeholder-user.jpg",
        initials: "MP",
      },
      attachments: [],
      likes: 2,
      comments: [
        {
          id: "c3",
          content: "The MNIST dataset might be too large for some of our algorithms. Let's discuss alternatives.",
          date: "2025-05-10",
          author: {
            name: "Alex Thompson",
            avatar: "/placeholder-user.jpg",
            initials: "AT",
          },
        },
      ],
    },
    {
      id: "u3",
      title: "Implementation Started",
      content:
        "We've started implementing the algorithms. Random Forest and SVM implementations are complete. Working on Neural Networks next.",
      date: "2025-05-20",
      author: {
        name: "Jason Lee",
        avatar: "/placeholder-user.jpg",
        initials: "JL",
      },
      attachments: [{ name: "code-repository-link.txt", size: "1 KB" }],
      likes: 4,
      comments: [],
    },
  ],
};

export default function ProjectDetailPage() {
  const params = useParams();

  const id = params.id as string;

  const [newComment, setNewComment] = useState("");
  const [activeTab, setActiveTab] = useState("updates");
  const [newUpdateContent, setNewUpdateContent] = useState("");
  const [newUpdateTitle, setNewUpdateTitle] = useState("");
  const [projectDetail, setProjectDetail] = useState<ProjectDetail>();

  const fetchProjectDetail = async () => {
    if (!id || typeof id !== "string") return;
    const response = await getProjectDetail({ project_id: id });
    setProjectDetail(response);
    console.log(response);
  };

  useEffect(() => {
    fetchProjectDetail();
  }, []);

  const handlePostComment = (updateId: string) => {
    if (newComment.trim()) {
      // In a real app, this would send the comment to an API
      console.log(`Posting comment to update ${updateId}: ${newComment}`);
      setNewComment("");
    }
  };

  const handlePostUpdate = () => {
    if (newUpdateTitle.trim() && newUpdateContent.trim()) {
      // In a real app, this would send the update to an API
      console.log(`Posting new update: ${newUpdateTitle} - ${newUpdateContent}`);
      setNewUpdateTitle("");
      setNewUpdateContent("");
    }
  };

  const handleChangeStatus = (status: string) => {
    // In a real app, this would update the project status via an API
    console.log(`Changing project status to: ${status}`);
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
                    <Select defaultValue={projectDetail?.project.status} onValueChange={handleChangeStatus}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Change status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
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
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(projectDetail?.project.deadline || "").toLocaleDateString()}</span>
                  </div>
                </div>

                <Separator />

                {/* <div>
                  <h3 className="text-sm font-medium mb-2">Project Lead</h3>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={project.teamLead.avatar || "/placeholder.svg"} alt={project.teamLead.name} />
                      <AvatarFallback>{project.teamLead.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{project.teamLead.name}</p>
                      <p className="text-xs text-muted-foreground">{project.teamLead.role}</p>
                    </div>
                  </div>
                </div> */}

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
                      <div key={student.name} className="flex items-center gap-2">
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
                  <Button className="w-full">
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
                <Button className="w-full" variant="outline">
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
                            <AvatarImage src={progress. || "/placeholder.svg"} alt={update.author.name} />
                            <AvatarFallback>{update.author.initials}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{update.author.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(update.date).toLocaleDateString()}
                            </p>
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
                      <CardTitle className="text-lg">{update.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="whitespace-pre-line">{update.content}</p>

                      {update.attachments.length > 0 && (
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
                      )}
                    </CardContent>
                    <CardFooter className="flex-col items-start pt-2">
                      <div className="flex items-center gap-4 w-full pb-2">
                        <Button variant="ghost" size="sm" className="gap-1">
                          <ThumbsUp className="h-4 w-4" />
                          Like ({update.likes})
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-1">
                          <MessageSquare className="h-4 w-4" />
                          Comment ({update.comments.length})
                        </Button>
                      </div>

                      {update.comments.length > 0 && (
                        <div className="w-full border-t pt-2 space-y-3">
                          {update.comments.map((comment) => (
                            <div key={comment.id} className="flex gap-2">
                              <Avatar className="h-7 w-7">
                                <AvatarImage
                                  src={comment.author.avatar || "/placeholder.svg"}
                                  alt={comment.author.name}
                                />
                                <AvatarFallback>{comment.author.initials}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="bg-muted p-2 rounded-md">
                                  <div className="flex justify-between items-center mb-1">
                                    <p className="text-xs font-medium">{comment.author.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {new Date(comment.date).toLocaleDateString()}
                                    </p>
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
                          <AvatarImage src="/placeholder-user.jpg" alt="Your Avatar" />
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
                            onClick={() => handlePostComment(update.id)}
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
    </div>
  );
}
