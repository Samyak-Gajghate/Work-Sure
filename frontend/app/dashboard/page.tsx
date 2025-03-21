"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Bell,
  Calendar,
  CreditCard,
  DollarSign,
  FileCheck,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Settings,
  Shield,
  Home,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <div className="flex items-center gap-2 font-bold text-lg">
          <Shield className="h-5 w-5 text-primary" />
          <span>PaySafe</span>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <Button variant="outline" size="icon" className="relative h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
              3
            </span>
            <span className="sr-only">Notifications</span>
          </Button>
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg" alt="User" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </div>
      </header>
      <div className="grid flex-1 md:grid-cols-[220px_1fr]">
        <div className="hidden border-r bg-muted/40 md:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex-1 overflow-auto py-2">
              <nav className="grid items-start px-2 text-sm font-medium">
                <Link
                  href="#"
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                    activeTab === "overview" ? "bg-muted text-primary" : "text-muted-foreground hover:text-foreground"
                  } transition-all`}
                  onClick={() => setActiveTab("overview")}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Overview
                </Link>
                <Link
                  href="#"
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                    activeTab === "projects" ? "bg-muted text-primary" : "text-muted-foreground hover:text-foreground"
                  } transition-all`}
                  onClick={() => setActiveTab("projects")}
                >
                  <FileCheck className="h-4 w-4" />
                  Projects
                </Link>
                <Link
                  href="#"
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                    activeTab === "payments" ? "bg-muted text-primary" : "text-muted-foreground hover:text-foreground"
                  } transition-all`}
                  onClick={() => setActiveTab("payments")}
                >
                  <CreditCard className="h-4 w-4" />
                  Payments
                </Link>
                <Link
                  href="#"
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                    activeTab === "messages" ? "bg-muted text-primary" : "text-muted-foreground hover:text-foreground"
                  } transition-all`}
                  onClick={() => setActiveTab("messages")}
                >
                  <MessageSquare className="h-4 w-4" />
                  Messages
                  <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">2</Badge>
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground"
                >
                  <Calendar className="h-4 w-4" />
                  Calendar
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
              </nav>
            </div>
            <div className="mt-auto p-4">
              <Button variant="outline" className="w-full justify-start gap-2">
                <LogOut className="h-4 w-4" />
                Log out
              </Button>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex items-center gap-4">
              <h1 className="font-semibold text-lg md:text-2xl">Dashboard</h1>
            </div>
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">$4,231.89</div>
                      <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                      <FileCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">3</div>
                      <p className="text-xs text-muted-foreground">+2 new this month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Pending Milestones</CardTitle>
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">7</div>
                      <p className="text-xs text-muted-foreground">2 due this week</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Escrow Balance</CardTitle>
                      <Shield className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">$1,250.00</div>
                      <p className="text-xs text-muted-foreground">Across 2 projects</p>
                    </CardContent>
                  </Card>
                </div>
                <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
                  <Card className="lg:col-span-4">
                    <CardHeader>
                      <CardTitle>Active Projects</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                              <span className="font-medium">E-commerce Website Redesign</span>
                              <Badge className="w-fit">In Progress</Badge>
                            </div>
                            <span className="text-sm text-muted-foreground">$2,500</span>
                          </div>
                          <Progress value={65} className="h-2" />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>65% Complete</span>
                            <span>Due in 12 days</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                              <span className="font-medium">Mobile App Development</span>
                              <Badge className="w-fit">In Progress</Badge>
                            </div>
                            <span className="text-sm text-muted-foreground">$4,000</span>
                          </div>
                          <Progress value={30} className="h-2" />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>30% Complete</span>
                            <span>Due in 30 days</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                              <span className="font-medium">Content Writing</span>
                              <Badge className="w-fit">In Progress</Badge>
                            </div>
                            <span className="text-sm text-muted-foreground">$800</span>
                          </div>
                          <Progress value={80} className="h-2" />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>80% Complete</span>
                            <span>Due in 5 days</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        View All Projects
                      </Button>
                    </CardFooter>
                  </Card>
                  <Card className="lg:col-span-3">
                    <CardHeader>
                      <CardTitle>Upcoming Milestones</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-start sm:items-center gap-4 flex-col sm:flex-row">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 shrink-0">
                            <FileCheck className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium leading-none">Homepage Design</p>
                            <p className="text-xs text-muted-foreground">E-commerce Website Redesign</p>
                          </div>
                          <div className="flex flex-row sm:flex-col items-start sm:items-end justify-between w-full sm:w-auto gap-1">
                            <p className="text-sm font-medium">$750</p>
                            <p className="text-xs text-muted-foreground">Due in 2 days</p>
                          </div>
                        </div>
                        <div className="flex items-start sm:items-center gap-4 flex-col sm:flex-row">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 shrink-0">
                            <FileCheck className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium leading-none">User Authentication</p>
                            <p className="text-xs text-muted-foreground">Mobile App Development</p>
                          </div>
                          <div className="flex flex-row sm:flex-col items-start sm:items-end justify-between w-full sm:w-auto gap-1">
                            <p className="text-sm font-medium">$1,200</p>
                            <p className="text-xs text-muted-foreground">Due in 7 days</p>
                          </div>
                        </div>
                        <div className="flex items-start sm:items-center gap-4 flex-col sm:flex-row">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 shrink-0">
                            <FileCheck className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium leading-none">Blog Articles (5)</p>
                            <p className="text-xs text-muted-foreground">Content Writing</p>
                          </div>
                          <div className="flex flex-row sm:flex-col items-start sm:items-end justify-between w-full sm:w-auto gap-1">
                            <p className="text-sm font-medium">$400</p>
                            <p className="text-xs text-muted-foreground">Due in 5 days</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        View All Milestones
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="analytics" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Analytics</CardTitle>
                    <CardDescription>View your earnings and project analytics</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px] flex items-center justify-center">
                    <p className="text-muted-foreground">Analytics charts will appear here</p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="reports" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Reports</CardTitle>
                    <CardDescription>View and download your reports</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px] flex items-center justify-center">
                    <p className="text-muted-foreground">Reports will appear here</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 border-t bg-background md:hidden">
        <div className="grid grid-cols-5 h-16">
          <Link
            href="#"
            className={`flex flex-col items-center justify-center gap-1 ${
              activeTab === "overview" ? "text-primary" : "text-muted-foreground"
            }`}
            onClick={() => setActiveTab("overview")}
          >
            <Home className="h-5 w-5" />
            <span className="text-[10px]">Home</span>
          </Link>
          <Link
            href="#"
            className={`flex flex-col items-center justify-center gap-1 ${
              activeTab === "projects" ? "text-primary" : "text-muted-foreground"
            }`}
            onClick={() => setActiveTab("projects")}
          >
            <FileCheck className="h-5 w-5" />
            <span className="text-[10px]">Projects</span>
          </Link>
          <Link
            href="#"
            className={`flex flex-col items-center justify-center gap-1 ${
              activeTab === "payments" ? "text-primary" : "text-muted-foreground"
            }`}
            onClick={() => setActiveTab("payments")}
          >
            <CreditCard className="h-5 w-5" />
            <span className="text-[10px]">Payments</span>
          </Link>
          <Link
            href="#"
            className={`flex flex-col items-center justify-center gap-1 ${
              activeTab === "messages" ? "text-primary" : "text-muted-foreground"
            }`}
            onClick={() => setActiveTab("messages")}
          >
            <MessageSquare className="h-5 w-5" />
            <span className="text-[10px]">Messages</span>
          </Link>
          <Link href="#" className="flex flex-col items-center justify-center gap-1 text-muted-foreground">
            <User className="h-5 w-5" />
            <span className="text-[10px]">Profile</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

