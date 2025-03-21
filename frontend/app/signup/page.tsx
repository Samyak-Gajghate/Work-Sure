"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"

export default function SignUp() {
  const [accountType, setAccountType] = useState("freelancer")

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Shield className="h-6 w-6 text-primary" />
            <span>PaySafe</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Log In
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2">
              <Link href="/">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ArrowLeft className="h-4 w-4" />
                  <span className="sr-only">Back</span>
                </Button>
              </Link>
              <CardTitle className="text-2xl">Create an account</CardTitle>
            </div>
            <CardDescription>Enter your information to create your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="account-type">Account Type</Label>
              <RadioGroup
                id="account-type"
                defaultValue="freelancer"
                className="grid grid-cols-2 gap-4"
                onValueChange={setAccountType}
              >
                <div>
                  <RadioGroupItem value="freelancer" id="freelancer" className="peer sr-only" />
                  <Label
                    htmlFor="freelancer"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <span className="mb-2 font-medium">Freelancer</span>
                    <span className="text-xs text-center text-muted-foreground">I want to offer services</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="client" id="client" className="peer sr-only" />
                  <Label
                    htmlFor="client"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <span className="mb-2 font-medium">Client</span>
                    <span className="text-xs text-center text-muted-foreground">I want to hire freelancers</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="first-name">First name</Label>
                <Input id="first-name" placeholder="John" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Last name</Label>
                <Input id="last-name" placeholder="Doe" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="john.doe@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input id="confirm-password" type="password" />
            </div>

            {accountType === "freelancer" && (
              <div className="space-y-2 pt-2">
                <Separator className="my-4" />
                <Label htmlFor="skills">Skills (comma separated)</Label>
                <Input id="skills" placeholder="Web Development, Design, Writing" />
              </div>
            )}

            {accountType === "client" && (
              <div className="space-y-2 pt-2">
                <Separator className="my-4" />
                <Label htmlFor="company">Company Name</Label>
                <Input id="company" placeholder="Acme Inc." />
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full">Create Account</Button>
            <div className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary underline-offset-4 hover:underline">
                Log in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}

