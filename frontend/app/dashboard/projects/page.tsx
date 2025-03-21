import Link from "next/link"
import { FileCheck, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ProjectsPage() {
  // Mock projects data
  const projects = [
    {
      id: "1",
      title: "E-commerce Website Redesign",
      client: "Acme Corporation",
      status: "In Progress",
      budget: 2500,
      progress: 65,
      dueDate: "2023-11-30",
      daysRemaining: 12,
    },
    {
      id: "2",
      title: "Mobile App Development",
      client: "TechStart Inc.",
      status: "In Progress",
      budget: 4000,
      progress: 30,
      dueDate: "2023-12-15",
      daysRemaining: 30,
    },
    {
      id: "3",
      title: "Content Writing",
      client: "BlogMedia",
      status: "In Progress",
      budget: 800,
      progress: 80,
      dueDate: "2023-11-20",
      daysRemaining: 5,
    },
    {
      id: "4",
      title: "Brand Identity Design",
      client: "NewVenture LLC",
      status: "Not Started",
      budget: 1500,
      progress: 0,
      dueDate: "2023-12-30",
      daysRemaining: 45,
    },
    {
      id: "5",
      title: "SEO Optimization",
      client: "GrowthHackers",
      status: "Completed",
      budget: 1200,
      progress: 100,
      dueDate: "2023-10-30",
      daysRemaining: 0,
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold md:text-2xl">Projects</h1>
        <Link href="/create-project">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="all">All Projects</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {projects
              .filter((p) => p.status !== "Completed")
              .map((project) => (
                <Card key={project.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Link href={`/projects/${project.id}`} className="hover:underline">
                        <CardTitle className="text-lg">{project.title}</CardTitle>
                      </Link>
                      <Badge variant={project.status === "In Progress" ? "default" : "secondary"}>
                        {project.status}
                      </Badge>
                    </div>
                    <CardDescription>Client: {project.client}</CardDescription>
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
                      <div className="flex justify-between text-sm">
                        <div className="flex items-center">
                          <FileCheck className="mr-1 h-4 w-4 text-muted-foreground" />
                          <span>${project.budget.toLocaleString()}</span>
                        </div>
                        <span className="text-muted-foreground">
                          {project.daysRemaining > 0 ? `Due in ${project.daysRemaining} days` : "Completed"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href={`/projects/${project.id}`}>View Details</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {projects
              .filter((p) => p.status === "Completed")
              .map((project) => (
                <Card key={project.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Link href={`/projects/${project.id}`} className="hover:underline">
                        <CardTitle className="text-lg">{project.title}</CardTitle>
                      </Link>
                      <Badge variant="outline">Completed</Badge>
                    </div>
                    <CardDescription>Client: {project.client}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span className="font-medium">100%</span>
                        </div>
                        <Progress value={100} className="h-2" />
                      </div>
                      <div className="flex justify-between text-sm">
                        <div className="flex items-center">
                          <FileCheck className="mr-1 h-4 w-4 text-muted-foreground" />
                          <span>${project.budget.toLocaleString()}</span>
                        </div>
                        <span className="text-muted-foreground">Completed</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href={`/projects/${project.id}`}>View Details</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {projects.map((project) => (
              <Card key={project.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Link href={`/projects/${project.id}`} className="hover:underline">
                      <CardTitle className="text-lg">{project.title}</CardTitle>
                    </Link>
                    <Badge
                      variant={
                        project.status === "Completed"
                          ? "outline"
                          : project.status === "In Progress"
                            ? "default"
                            : "secondary"
                      }
                    >
                      {project.status}
                    </Badge>
                  </div>
                  <CardDescription>Client: {project.client}</CardDescription>
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
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center">
                        <FileCheck className="mr-1 h-4 w-4 text-muted-foreground" />
                        <span>${project.budget.toLocaleString()}</span>
                      </div>
                      <span className="text-muted-foreground">
                        {project.daysRemaining > 0 ? `Due in ${project.daysRemaining} days` : "Completed"}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/projects/${project.id}`}>View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

