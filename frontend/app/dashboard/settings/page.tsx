"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

export default function SettingsPage() {
  const [profileImage, setProfileImage] = useState("/placeholder.svg")

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold md:text-2xl">Settings</h1>
        <Button>Save Changes</Button>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your profile information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4 items-start">
                <div className="flex flex-col items-center gap-2">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profileImage} alt="Profile" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm">
                    Change Photo
                  </Button>
                </div>
                <div className="grid gap-4 flex-1">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First Name</Label>
                      <Input id="first-name" defaultValue="John" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input id="last-name" defaultValue="Doe" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="john.doe@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Professional Title</Label>
                    <Input id="title" defaultValue="Full Stack Developer" />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  className="min-h-[120px]"
                  defaultValue="Experienced full stack developer with expertise in React, Node.js, and database design. Passionate about creating intuitive user experiences and scalable backend solutions."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">Skills</Label>
                <Textarea
                  id="skills"
                  placeholder="Web Development, React, Node.js, UI/UX Design"
                  defaultValue="Web Development, React, Node.js, UI/UX Design, Database Design, API Development"
                />
                <p className="text-sm text-muted-foreground">Separate skills with commas</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" defaultValue="San Francisco, CA" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" type="url" defaultValue="https://johndoe.com" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Profile</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Social Profiles</CardTitle>
              <CardDescription>Connect your social media accounts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="github">GitHub</Label>
                  <Input id="github" defaultValue="github.com/johndoe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input id="linkedin" defaultValue="linkedin.com/in/johndoe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input id="twitter" defaultValue="twitter.com/johndoe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dribbble">Dribbble</Label>
                  <Input id="dribbble" placeholder="dribbble.com/username" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Social Profiles</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" defaultValue="johndoe" />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Two-Factor Authentication</Label>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <p className="font-medium">Two-factor authentication</p>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Account Settings</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Danger Zone</CardTitle>
              <CardDescription>Irreversible account actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-destructive/20 p-4">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-0.5">
                    <p className="font-medium">Delete Account</p>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete your account and all of your data
                    </p>
                  </div>
                  <Button variant="destructive">Delete Account</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
              <CardDescription>Manage your billing information and payment methods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">Free Plan</p>
                      <Badge>Current</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Basic features with limited projects</p>
                  </div>
                  <Button>Upgrade Plan</Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Payment Methods</Label>
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="rounded-md bg-muted p-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                        >
                          <rect width="20" height="14" x="2" y="5" rx="2" />
                          <line x1="2" x2="22" y1="10" y2="10" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">Visa ending in 1234</p>
                        <p className="text-sm text-muted-foreground">Expires 12/2025</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Default</Badge>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="mt-2">
                  Add Payment Method
                </Button>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Billing Address</Label>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="address-line1">Address Line 1</Label>
                    <Input id="address-line1" defaultValue="123 Main St" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address-line2">Address Line 2</Label>
                    <Input id="address-line2" defaultValue="Apt 4B" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" defaultValue="San Francisco" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Select defaultValue="CA">
                      <SelectTrigger id="state">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CA">California</SelectItem>
                        <SelectItem value="NY">New York</SelectItem>
                        <SelectItem value="TX">Texas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input id="zip" defaultValue="94103" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Select defaultValue="US">
                      <SelectTrigger id="country">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="US">United States</SelectItem>
                        <SelectItem value="CA">Canada</SelectItem>
                        <SelectItem value="UK">United Kingdom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Billing Information</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Email Notifications</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <p className="font-medium">Project Updates</p>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications about project status changes
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <p className="font-medium">Payment Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications about payments and withdrawals
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <p className="font-medium">Messages</p>
                      <p className="text-sm text-muted-foreground">Receive email notifications for new messages</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <p className="font-medium">Marketing</p>
                      <p className="text-sm text-muted-foreground">Receive emails about new features and promotions</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Push Notifications</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <p className="font-medium">Enable Push Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive notifications on your device</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <p className="font-medium">Project Milestones</p>
                      <p className="text-sm text-muted-foreground">
                        Get notified about upcoming and completed milestones
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <p className="font-medium">New Messages</p>
                      <p className="text-sm text-muted-foreground">Get notified when you receive new messages</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Notification Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

