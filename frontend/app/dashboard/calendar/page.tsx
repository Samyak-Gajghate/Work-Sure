"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [view, setView] = useState("month")

  // Mock events data
  const events = [
    {
      id: "e1",
      title: "Client Meeting - Acme Corp",
      date: new Date(2023, 10, 15, 10, 0),
      endDate: new Date(2023, 10, 15, 11, 0),
      type: "meeting",
      description: "Discuss homepage design feedback",
    },
    {
      id: "e2",
      title: "Homepage Design Milestone Due",
      date: new Date(2023, 10, 5, 23, 59),
      type: "deadline",
      description: "Submit final homepage designs",
    },
    {
      id: "e3",
      title: "Team Standup",
      date: new Date(2023, 10, 17, 9, 0),
      endDate: new Date(2023, 10, 17, 9, 30),
      type: "meeting",
      description: "Weekly progress update",
    },
    {
      id: "e4",
      title: "Product Pages Milestone Due",
      date: new Date(2023, 10, 15, 23, 59),
      type: "deadline",
      description: "Submit product page designs",
    },
    {
      id: "e5",
      title: "Client Call - TechStart Inc",
      date: new Date(2023, 10, 20, 14, 0),
      endDate: new Date(2023, 10, 20, 15, 0),
      type: "meeting",
      description: "Discuss mobile app requirements",
    },
  ]

  // Get today's events
  const today = new Date()
  const todayEvents = events.filter(
    (event) =>
      event.date.getDate() === today.getDate() &&
      event.date.getMonth() === today.getMonth() &&
      event.date.getFullYear() === today.getFullYear(),
  )

  // Get upcoming events (next 7 days)
  const nextWeek = new Date()
  nextWeek.setDate(nextWeek.getDate() + 7)

  const upcomingEvents = events
    .filter((event) => event.date > today && event.date <= nextWeek)
    .sort((a, b) => a.date.getTime() - b.date.getTime())

  // Format date for display
  const formatEventTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatEventDate = (date: Date) => {
    return date.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold md:text-2xl">Calendar</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Event
        </Button>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    const newDate = new Date(date!)
                    newDate.setMonth(newDate.getMonth() - 1)
                    setDate(newDate)
                  }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    const newDate = new Date(date!)
                    newDate.setMonth(newDate.getMonth() + 1)
                    setDate(newDate)
                  }}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <h2 className="text-lg font-semibold">
                  {date?.toLocaleDateString([], { month: "long", year: "numeric" })}
                </h2>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant={view === "month" ? "default" : "outline"} size="sm" onClick={() => setView("month")}>
                  Month
                </Button>
                <Button variant={view === "week" ? "default" : "outline"} size="sm" onClick={() => setView("week")}>
                  Week
                </Button>
                <Button variant={view === "day" ? "default" : "outline"} size="sm" onClick={() => setView("day")}>
                  Day
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Today</CardTitle>
              <CardDescription>
                {today.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {todayEvents.length > 0 ? (
                <div className="space-y-4">
                  {todayEvents.map((event) => (
                    <div key={event.id} className="flex items-start space-x-3">
                      <div className="w-14 text-sm text-muted-foreground">{formatEventTime(event.date)}</div>
                      <div
                        className={`w-1 self-stretch rounded-full ${
                          event.type === "meeting" ? "bg-blue-500" : "bg-yellow-500"
                        }`}
                      />
                      <div className="flex-1">
                        <p className="font-medium">{event.title}</p>
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No events scheduled for today</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Next 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingEvents.length > 0 ? (
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="flex items-start space-x-3">
                      <div className="w-14 flex flex-col text-sm text-muted-foreground">
                        <span>{formatEventDate(event.date)}</span>
                        <span>{formatEventTime(event.date)}</span>
                      </div>
                      <div
                        className={`w-1 self-stretch rounded-full ${
                          event.type === "meeting" ? "bg-blue-500" : "bg-yellow-500"
                        }`}
                      />
                      <div className="flex-1">
                        <p className="font-medium">{event.title}</p>
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No upcoming events in the next 7 days</p>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Events
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

