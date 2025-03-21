"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Send, Paperclip, MoreHorizontal, Phone, Video } from "lucide-react"

export default function MessagesPage() {
  const [activeChat, setActiveChat] = useState("1")

  // Mock contacts data
  const contacts = [
    {
      id: "1",
      name: "John Smith",
      company: "Acme Corporation",
      avatar: "/placeholder.svg",
      lastMessage: "I've reviewed the wireframes and they look great!",
      time: "10:30 AM",
      unread: 2,
      online: true,
    },
    {
      id: "2",
      name: "Sarah Johnson",
      company: "TechStart Inc.",
      avatar: "/placeholder.svg",
      lastMessage: "When can we discuss the next milestone?",
      time: "Yesterday",
      unread: 0,
      online: false,
    },
    {
      id: "3",
      name: "Michael Brown",
      company: "BlogMedia",
      avatar: "/placeholder.svg",
      lastMessage: "The articles are approved. Payment sent!",
      time: "Yesterday",
      unread: 0,
      online: true,
    },
    {
      id: "4",
      name: "Emily Davis",
      company: "NewVenture LLC",
      avatar: "/placeholder.svg",
      lastMessage: "Let's schedule a call to discuss the brand identity.",
      time: "Monday",
      unread: 0,
      online: false,
    },
  ]

  // Mock messages for the active chat
  const messages = [
    {
      id: "m1",
      sender: "client",
      text: "Hi there! I wanted to check in on the progress of the e-commerce website redesign.",
      time: "10:00 AM",
    },
    {
      id: "m2",
      sender: "me",
      text: "Hello! I've completed the wireframes and sitemap as per our first milestone. I'll be sharing them with you shortly.",
      time: "10:15 AM",
    },
    {
      id: "m3",
      sender: "client",
      text: "That sounds great! Looking forward to seeing them.",
      time: "10:20 AM",
    },
    {
      id: "m4",
      sender: "me",
      text: "I've just uploaded the wireframes to the project. You can review them in the submissions tab.",
      time: "10:25 AM",
    },
    {
      id: "m5",
      sender: "client",
      text: "I've reviewed the wireframes and they look great! Just a couple of small suggestions for the homepage layout.",
      time: "10:30 AM",
    },
  ]

  const activeContact = contacts.find((contact) => contact.id === activeChat)

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)]">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold md:text-2xl">Messages</h1>
        <Button variant="outline" size="sm">
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>

      <div className="flex flex-1 overflow-hidden border rounded-lg">
        {/* Contacts sidebar */}
        <div className="w-full md:w-80 border-r hidden md:block">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search contacts..." className="pl-8" />
            </div>
          </div>
          <div className="overflow-auto h-[calc(100vh-12rem)]">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className={`flex items-start gap-3 p-3 cursor-pointer hover:bg-muted/50 ${
                  activeChat === contact.id ? "bg-muted" : ""
                }`}
                onClick={() => setActiveChat(contact.id)}
              >
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={contact.avatar} alt={contact.name} />
                    <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {contact.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium truncate">{contact.name}</p>
                    <span className="text-xs text-muted-foreground">{contact.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{contact.company}</p>
                  <p className="text-sm truncate">{contact.lastMessage}</p>
                </div>
                {contact.unread > 0 && <Badge className="ml-auto">{contact.unread}</Badge>}
              </div>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          {activeContact ? (
            <>
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={activeContact.avatar} alt={activeContact.name} />
                    <AvatarFallback>{activeContact.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{activeContact.name}</p>
                    <p className="text-sm text-muted-foreground">{activeContact.company}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex-1 overflow-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.sender === "me" ? "bg-primary text-primary-foreground ml-auto" : "bg-muted"
                      }`}
                    >
                      <p>{message.text}</p>
                      <p className="text-xs mt-1 opacity-70 text-right">{message.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Input placeholder="Type a message..." className="flex-1" />
                  <Button size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h3 className="text-lg font-medium">Select a conversation</h3>
                <p className="text-muted-foreground">Choose a contact to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

