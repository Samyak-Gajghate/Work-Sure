"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Plus, Shield, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DatePicker } from "@/components/date-picker"
import { Separator } from "@/components/ui/separator"

export default function CreateProject() {
  const [milestones, setMilestones] = useState([{ id: 1, title: "", amount: "", dueDate: null }])

  const addMilestone = () => {
    const newId = milestones.length > 0 ? Math.max(...milestones.map((m) => m.id)) + 1 : 1
    setMilestones([...milestones, { id: newId, title: "", amount: "", dueDate: null }])
  }

  const removeMilestone = (id: number) => {
    if (milestones.length > 1) {
      setMilestones(milestones.filter((m) => m.id !== id))
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg">
          <Shield className="h-5 w-5 text-primary" />
          <span>PaySafe</span>
        </Link>
      </header>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h1 className="text-xl font-bold md:text-2xl">Create New Project</h1>
        </div>
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
              <CardDescription>Enter the details of your new project</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title</Label>
                <Input id="title" placeholder="Enter project title" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client">Client Name</Label>
                <Input id="client" placeholder="Enter client name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client-email">Client Email</Label>
                <Input id="client-email" type="email" placeholder="Enter client email" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Start Date</Label>
                  <DatePicker />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">End Date</Label>
                  <DatePicker />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Project Description</Label>
                <Textarea id="description" placeholder="Describe the project" className="min-h-[120px]" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Project Budget</CardTitle>
              <CardDescription>Set the total budget for this project</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="budget">Total Budget ($)</Label>
                <Input id="budget" type="number" placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Input id="currency" value="USD" disabled />
              </div>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Project Milestones</CardTitle>
                <CardDescription>Break down your project into payment milestones</CardDescription>
              </div>
              <Button onClick={addMilestone} variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Milestone
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {milestones.map((milestone, index) => (
              <div key={milestone.id} className="space-y-4">
                {index > 0 && <Separator />}
                <div className="pt-4 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_200px_200px_40px]">
                  <div className="space-y-2">
                    <Label htmlFor={`milestone-${milestone.id}-title`}>Milestone Title</Label>
                    <Input id={`milestone-${milestone.id}-title`} placeholder="Enter milestone title" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`milestone-${milestone.id}-amount`}>Amount ($)</Label>
                    <Input id={`milestone-${milestone.id}-amount`} type="number" placeholder="0.00" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`milestone-${milestone.id}-date`}>Due Date</Label>
                    <DatePicker />
                  </div>
                  <div className="flex items-end justify-end sm:justify-start lg:justify-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeMilestone(milestone.id)}
                      disabled={milestones.length <= 1}
                    >
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Cancel</Button>
            <Button>Create Project</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

