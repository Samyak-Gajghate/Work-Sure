"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Calendar,
  Check,
  Clock,
  DollarSign,
  FileCheck,
  MessageSquare,
  MoreHorizontal,
  Shield,
  Upload,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function ProjectDetails({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("overview")

  // Mock project data
  const project = {
    id: params.id,
    title: "E-commerce Website Redesign",
    client: "Acme Corporation",
    status: "In Progress",
    budget: 2500,
    startDate: "2023-10-15",
    endDate: "2023-11-30",
    description:
      "Complete redesign of the e-commerce website including homepage, product listings, product details, cart, and checkout process.",
    progress: 65,
    milestones: [
      {
        id: "m1",
        title: "Project Planning & Wireframes",
        amount: 500,
        status: "Completed",
        dueDate: "2023-10-25",
        completedDate: "2023-10-23",
      },
      {
        id: "m2",
        title: "Homepage Design",
        amount: 750,
        status: "In Progress",
        dueDate: "2023-11-05",
        completedDate: null,
      },
      {
        id: "m3",
        title: "Product Pages",
        amount: 750,
        status: "Not Started",
        dueDate: "2023-11-15",
        completedDate: null,
      },
      {
        id: "m4",
        title: "Checkout Process",
        amount: 500,
        status: "Not Started",
        dueDate: "2023-11-30",
        completedDate: null,
      },
    ],
    submissions: [
      {
        id: "s1",
        milestoneId: "m1",
        title: "Wireframes and Sitemap",
        date: "2023-10-23",
        status: "Approved",
        files: ["wireframes.pdf", "sitemap.pdf"],
        comments: [
          {
            user: "Client",
            text: "Looks great! I approve this milestone.",
            date: "2023-10-24",
          },
        ],
      },
      {
        id: "s2",
        milestoneId: "m2",
        title: "Homepage Design Mockups",
        date: "2023-11-02",
        status: "Pending Review",
        files: ["homepage-desktop.png", "homepage-mobile.png"],
        comments: [
          {
            user: "Freelancer",
            text: "Here are the homepage mockups for desktop and mobile. Looking forward to your feedback!",
            date: "2023-11-02",
          },
        ],
      },
    ],
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg">
          <Shield className="h-5 w-5 text-primary" />
          <span>PaySafe</span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <Button variant="outline" size="sm">
            <MessageSquare className="mr-2 h-4 w-4" />
            Message Client
          </Button>
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg" alt="User" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </div>
      </header>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-bold md:text-2xl">{project.title}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Client: {project.client}</span>
              <span>•</span>
              <Badge variant={project.status === "In Progress" ? "default" : "outline"}>{project.status}</Badge>
            </div>
          </div>
          <div className="ml-auto flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem>Edit Project</DropdownMenuItem>
                <DropdownMenuItem>Contact Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">Cancel Project</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-7">
          <Card className="md:col-span-5">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <CardTitle>Project Overview</CardTitle>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="font-bold">${project.budget.toLocaleString()}</span>
                </div>
              </div>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Start: {new Date(project.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>End: {new Date(project.endDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {Math.ceil((new Date(project.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}{" "}
                      days remaining
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Client</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder.svg" alt="Client" />
                  <AvatarFallback>AC</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{project.client}</p>
                  <p className="text-sm text-muted-foreground">client@acmecorp.com</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <MessageSquare className="mr-2 h-4 w-4" />
                Contact
              </Button>
            </CardFooter>
          </Card>
        </div>
        <Tabs defaultValue="milestones" className="space-y-4">
          <TabsList>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
            <TabsTrigger value="submissions">Submissions</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>
          <TabsContent value="milestones" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Project Milestones</CardTitle>
                <CardDescription>Track your project milestones and payments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {project.milestones.map((milestone) => (
                    <div key={milestone.id} className="rounded-lg border p-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          {milestone.status === "Completed" ? (
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 shrink-0">
                              <Check className="h-4 w-4 text-primary" />
                            </div>
                          ) : (
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted shrink-0">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium">{milestone.title}</p>
                            <p className="text-sm text-muted-foreground">
                              Due: {new Date(milestone.dueDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 sm:gap-0 w-full sm:w-auto justify-between">
                          <p className="font-bold">${milestone.amount}</p>
                          <Badge
                            variant={
                              milestone.status === "Completed"
                                ? "outline"
                                : milestone.status === "In Progress"
                                  ? "default"
                                  : "secondary"
                            }
                          >
                            {milestone.status}
                          </Badge>
                        </div>
                      </div>
                      {milestone.status === "In Progress" && (
                        <div className="mt-4 flex justify-end">
                          <Button>
                            <Upload className="mr-2 h-4 w-4" />
                            Submit Work
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="submissions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Work Submissions</CardTitle>
                <CardDescription>View and manage your work submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {project.submissions.map((submission) => (
                    <div key={submission.id} className="rounded-lg border p-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <div>
                          <p className="font-medium">{submission.title}</p>
                          <p className="text-sm text-muted-foreground">
                            Submitted: {new Date(submission.date).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge
                          variant={
                            submission.status === "Approved"
                              ? "outline"
                              : submission.status === "Pending Review"
                                ? "default"
                                : "secondary"
                          }
                          className="mt-1 sm:mt-0"
                        >
                          {submission.status}
                        </Badge>
                      </div>
                      <div className="mt-4">
                        <p className="text-sm font-medium">Files:</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {submission.files.map((file) => (
                            <Button key={file} variant="outline" size="sm" className="h-8">
                              <FileCheck className="mr-2 h-4 w-4" />
                              {file}
                            </Button>
                          ))}
                        </div>
                      </div>
                      <Accordion type="single" collapsible className="mt-4">
                        <AccordionItem value="comments">
                          <AccordionTrigger className="text-sm">Comments</AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-4">
                              {submission.comments.map((comment, index) => (
                                <div key={index} className="rounded-lg bg-muted p-3">
                                  <div className="flex items-center gap-2">
                                    <Avatar className="h-6 w-6">
                                      <AvatarFallback>{comment.user.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm font-medium">{comment.user}</span>
                                    <span className="text-xs text-muted-foreground">
                                      {new Date(comment.date).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p className="mt-2 text-sm">{comment.text}</p>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="messages" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Messages</CardTitle>
                <CardDescription>Communication with your client</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] flex items-center justify-center">
                <p className="text-muted-foreground">Messages will appear here</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

