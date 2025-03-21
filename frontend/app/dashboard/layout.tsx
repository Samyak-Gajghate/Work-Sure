"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Bell,
  Calendar,
  CreditCard,
  FileCheck,
  Home,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Settings,
  Shield,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg">
          <Shield className="h-5 w-5 text-primary" />
          <span>PaySafe</span>
        </Link>
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
                  href="/dashboard"
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                    isActive("/dashboard") &&
                    !isActive("/dashboard/projects") &&
                    !isActive("/dashboard/payments") &&
                    !isActive("/dashboard/messages") &&
                    !isActive("/dashboard/calendar") &&
                    !isActive("/dashboard/messages") &&
                    !isActive("/dashboard/calendar") &&
                    !isActive("/dashboard/settings")
                      ? "bg-muted text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  } transition-all`}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Overview
                </Link>
                <Link
                  href="/dashboard/projects"
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                    isActive("/dashboard/projects")
                      ? "bg-muted text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  } transition-all`}
                >
                  <FileCheck className="h-4 w-4" />
                  Projects
                </Link>
                <Link
                  href="/dashboard/payments"
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                    isActive("/dashboard/payments")
                      ? "bg-muted text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  } transition-all`}
                >
                  <CreditCard className="h-4 w-4" />
                  Payments
                </Link>
                <Link
                  href="/dashboard/messages"
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                    isActive("/dashboard/messages")
                      ? "bg-muted text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  } transition-all`}
                >
                  <MessageSquare className="h-4 w-4" />
                  Messages
                  <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">2</Badge>
                </Link>
                <Link
                  href="/dashboard/calendar"
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                    isActive("/dashboard/calendar")
                      ? "bg-muted text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  } transition-all`}
                >
                  <Calendar className="h-4 w-4" />
                  Calendar
                </Link>
                <Link
                  href="/dashboard/settings"
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                    isActive("/dashboard/settings")
                      ? "bg-muted text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  } transition-all`}
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
              </nav>
            </div>
            <div className="mt-auto p-4">
              <Button variant="outline" className="w-full justify-start gap-2" asChild>
                <Link href="/">
                  <LogOut className="h-4 w-4" />
                  Log out
                </Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">{children}</main>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 border-t bg-background md:hidden">
        <div className="grid grid-cols-5 h-16">
          <Link
            href="/dashboard"
            className={`flex flex-col items-center justify-center gap-1 ${
              isActive("/dashboard") &&
              !isActive("/dashboard/projects") &&
              !isActive("/dashboard/payments") &&
              !isActive("/dashboard/messages") &&
              !isActive("/dashboard/calendar") &&
              !isActive("/dashboard/settings")
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            <Home className="h-5 w-5" />
            <span className="text-[10px]">Home</span>
          </Link>
          <Link
            href="/dashboard/projects"
            className={`flex flex-col items-center justify-center gap-1 ${
              isActive("/dashboard/projects") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <FileCheck className="h-5 w-5" />
            <span className="text-[10px]">Projects</span>
          </Link>
          <Link
            href="/dashboard/payments"
            className={`flex flex-col items-center justify-center gap-1 ${
              isActive("/dashboard/payments") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <CreditCard className="h-5 w-5" />
            <span className="text-[10px]">Payments</span>
          </Link>
          <Link
            href="/dashboard/messages"
            className={`flex flex-col items-center justify-center gap-1 ${
              isActive("/dashboard/messages") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <MessageSquare className="h-5 w-5" />
            <span className="text-[10px]">Messages</span>
          </Link>
          <Link
            href="/dashboard/settings"
            className={`flex flex-col items-center justify-center gap-1 ${
              isActive("/dashboard/settings") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <User className="h-5 w-5" />
            <span className="text-[10px]">Profile</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

