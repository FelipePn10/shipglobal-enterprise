"use client"

import type React from "react"

import { useState } from "react"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, MessageSquare, Plus } from "lucide-react"
import Image from "next/image"

export default function MessagesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedConversation, setSelectedConversation] = useState<number | null>(1)
  const [newMessage, setNewMessage] = useState("")
  
  // Mock conversations data
  const conversations = [
    {
      id: 1,
      contact: {
        name: "Sarah Johnson",
        role: "Customs Agent",
        avatar: "/placeholder.svg",
        online: true,
      },
      lastMessage: {
        text: "We need additional documentation for the electronics shipment. Please provide the certificate of origin by tomorrow.",
        timestamp: "2:30 PM",
        isRead: false,
        sender: "them",
      },
      unread: 1,
    },
    {
      id: 2,
      contact: {
        name: "Michael Chen",
        role: "Logistics Manager",
        avatar: "/placeholder.svg",
        online: true,
      },
      lastMessage: {
        text: "The furniture shipment has cleared customs and is now in transit to the warehouse. Expected delivery on schedule.",
        timestamp: "11:15 AM",
        isRead: true,
        sender: "them",
      },
      unread: 0,
    },
    {
      id: 3,
      contact: {
        name: "Emma Davis",
        role: "Account Manager",
        avatar: "/placeholder.svg",
        online: false,
      },
      lastMessage: {
        text: "Your monthly import report is ready. I've attached the summary for your review. Let me know if you have any questions.",
        timestamp: "Yesterday",
        isRead: true,
        sender: "them",
      },
      unread: 0,
    },
    {
      id: 4,
      contact: {
        name: "Robert Wilson",
        role: "Finance Analyst",
        avatar: "/placeholder.svg",
        online: false,
      },
      lastMessage: {
        text: "I've processed the payment for the shipping costs. You should receive confirmation shortly.",
        timestamp: "Yesterday",
        isRead: true,
        sender: "them",
      },
      unread: 0,
    },
    {
      id: 5,
      contact: {
        name: "Jennifer Lee",
        role: "Documentation Specialist",
        avatar: "/placeholder.svg",
        online: false,
      },
      lastMessage: {
        text: "The revised customs forms have been approved. We're good to proceed with the shipment.",
        timestamp: "2 days ago",
        isRead: true,
        sender: "them",
      },
      unread: 0,
    },
  ]
  
  // Mock messages for the selected conversation
  const messages = [
    {
      id: 1,
      text: "Hello John, I'm reviewing the documentation for your electronics shipment (IMP-2023-0042).",
      timestamp: "Yesterday, 4:15 PM",
      sender: "them",
      senderName: "Sarah Johnson",
      senderAvatar: "/placeholder.svg",
    },
    {
      id: 2,
      text: "Hi Sarah, thanks for looking into this. Is everything in order?",
      timestamp: "Yesterday, 4:20 PM",
      sender: "me",
    },
    {
      id: 3,
      text: "I've noticed that the Certificate of Origin is missing from the documentation. We'll need this for customs clearance.",
      timestamp: "Yesterday, 4:25 PM",
      sender: "them",
      senderName: "Sarah Johnson",
      senderAvatar: "/placeholder.svg",
    },
    {
      id: 4,
      text: "I thought I had included that in the initial submission. Let me check my files.",
      timestamp: "Yesterday, 4:30 PM",
      sender: "me",
    },
    {
      id: 5,
      text: "No problem. Please submit it as soon as possible to avoid any delays in customs processing.",
      timestamp: "Yesterday, 4:35 PM",
      sender: "them",
      senderName: "Sarah Johnson",
      senderAvatar: "/placeholder.svg",
    },
    {
      id: 6,
      text: "I've found the document. I'll upload it to the system right away.",
      timestamp: "Yesterday, 5:00 PM",
      sender: "me",
    },
    {
      id: 7,
      text: "We need additional documentation for the electronics shipment. Please provide the certificate of origin by tomorrow.",
      timestamp: "Today, 2:30 PM",
      sender: "them",
      senderName: "Sarah Johnson",
      senderAvatar: "/placeholder.svg",
      attachment: {
        name: "Required_Documents_List.pdf",
        type: "PDF",
        size: "245 KB",
        url: "#",
      },
    },
  ]
  
  // Filter conversations based on search
  const filteredConversations = conversations.filter(conversation => 
    conversation.contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conversation.contact.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conversation.lastMessage.text.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  // Handle sending a new message
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, this would send the message to the server
      console.log("Sending message:", newMessage)
      setNewMessage("")
    }
  }
  
  // Handle key down event for input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }
  
  // Get selected conversation
  const getSelectedConversation = () => {
    return conversations.find(conversation => conversation.id === selectedConversation) || null
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-white">Messages</h1>
            <p className="text-white/60">Communicate with your team and partners</p>
          </div>
          <div className="flex items-center gap-3">
            <Button className="bg-gradient-to-r from-indigo-500 to-rose-500 hover:from-indigo-600 hover:to-rose-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              New Message
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 h-[calc(100vh-200px)]">
          {/* Conversations List */}
          <div className="border-r border-white/10">
            <div className="p-4 border-b border-white/10">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
                <Input
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                />
              </div>
            </div>
            
            <Tabs defaultValue="all" className="w-full">
              <div className="px-4 pt-4">
                <TabsList className="bg-white/5 border-white/10 w-full">
                  <TabsTrigger
                    value="all"
                    className="flex-1 data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60"
                  >
                    All
                  </TabsTrigger>
                  <TabsTrigger
                    value="unread"
                    className="flex-1 data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60"
                  >
                    Unread
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="all" className="mt-0">
                <div className="overflow-y-auto h-[calc(100vh-300px)]">
                  {filteredConversations.length > 0 ? (
                    filteredConversations.map((conversation) => (
                      <div 
                        key={conversation.id} 
                        className={`p-4 border-b border-white/5 cursor-pointer transition-colors ${
                          selectedConversation === conversation.id 
                            ? 'bg-white/10' 
                            : 'hover:bg-white/[0.07]'
                        } ${
                          conversation.unread > 0 && 'border-l-2 border-l-indigo-500'
                        }`}
                        onClick={() => setSelectedConversation(conversation.id)}
                      >
                        <div className="flex gap-3">
                          <div className="relative flex-shrink-0">
                            <Image 
                              src={conversation.contact.avatar || "/placeholder.svg"} 
                              alt={conversation.contact.name} 
                              width={40} 
                              height={40} 
                              className="rounded-full"
                            />
                            {conversation.contact.online && (
                              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-black"></div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className={`font-medium ${conversation.unread > 0 ? 'text-white' : 'text-white/90'}`}>
                                  {conversation.contact.name}
                                </p>
                                <p className="text-white/60 text-xs">{conversation.contact.role}</p>
                              </div>
                              <div className="flex flex-col items-end">
                                <span className="text-white/40 text-xs">{conversation.lastMessage.timestamp}</span>
                                {conversation.unread > 0 && (
                                  <span className="bg-indigo-500 text-white text-xs rounded-full h-5 min-w-5 flex items-center justify-center px-1 mt-1">
                                    {conversation.unread}
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <p className={`text-sm truncate mt-1 ${
                              conversation.unread > 0 ? 'text-white/90' : 'text-white/60'
                            }`}>
                              {conversation.lastMessage.sender === 'me' && 'You: '}
                              {conversation.lastMessage.text}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                      <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                        <MessageSquare className="h-8 w-8 text-white/20" />
                      </div>
                      <h3 className="text-xl font-medium text-white mb-2">No conversations found</h3>
                      <p className="text-white/60">
                        {searchQuery 
                          ? "We couldn't find any conversations matching your search."
                          : "You don't have any conversations yet."}
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="unread" className="mt-0">
                <div className="overflow-y-auto h-[calc(100vh-300px)]">
                  {filteredConversations.filter(c => c.unread > 0).length > 0 ? (
                    filteredConversations
                      .filter(conversation => conversation.unread > 0)
                      .map((conversation) => (
                        <div 
                          key={conversation.id} 
                          className={`p-4 border-b border-white/5 cursor-pointer transition-colors ${
                            selectedConversation === conversation.id 
                              ? 'bg-white/10' 
                              : 'hover:bg-white/[0.07]'
                          } border-l-2 border-l-indigo-500`}
                          onClick={() => setSelectedConversation(conversation.id)}
                        >
                          <div className="flex gap-3">
                            <div className="relative flex-shrink-0">
                              <Image 
                                src={conversation.contact.avatar || "/placeholder.svg"} 
                                alt={conversation.contact.name} 
                                width={40} 
                                height={40} 
                                className="rounded-full"
                              />
                              {conversation.contact.online && (
                                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-black"></div>
                              )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium text-white">
                                    {conversation.contact.name}
                                  </p>
                                  <p className="text-white/60 text-xs">{conversation.contact.role}</p>
                                </div>
                                <div className="flex flex-col items-end">
                                  <span className="text-white/40 text-xs">{conversation.lastMessage.timestamp}</span>
                                  <span className="bg-indigo-500 text-white text-xs rounded-full h-5 min-w-5 flex items-center justify-center px-1 mt-1">
                                    {conversation.unread}
                                  </span>
                                </div>
                              </div>
                              
                              <p className="text-sm truncate mt-1 text-white/90">
                                {conversation.lastMessage.text}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                      <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                        <MessageSquare className="h-8 w-8 text-white/20" />
                      </div>
                      <h3 className="text-xl font-medium text-white mb-2">No unread messages</h3>
                      <p className="text-white/60">
                        Youve read all your messages. Great job staying up to date!
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Message Content Area */}
          <div className="col-span-2 flex flex-col h-full">
            {selectedConversation ? (
              <>
                {/* Conversation Header */}
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Image 
                        src={getSelectedConversation()?.contact.avatar || "/placeholder.svg"} 
                        alt={getSelectedConversation()?.contact.name || "Contact"} 
                        width={40} 
                        height={40} 
                        className="rounded-full"
                      />
                      {getSelectedConversation()?.contact.online && (
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-black"></div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-white">{getSelectedConversation()?.contact.name}</p>
                      <p className="text-white/60 text-xs">{getSelectedConversation()?.contact.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="text-white/60 hover:text-white hover:bg-white/10">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Message List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex gap-3 max-w-[80%] ${message.sender === 'me' ? 'flex-row-reverse' : 'flex-row'}`}>
                        {message.sender !== 'me' && (
                          <div className="flex-shrink-0">
                            <Image 
                              src={message.senderAvatar || "/placeholder.svg"} 
                              alt={message.senderName || "User"} 
                              width={32} 
                              height={32} 
                              className="rounded-full"
                            />
                          </div>
                        )}
                        <div>
                          <div className={`rounded-lg px-4 py-2 ${
                            message.sender === 'me' 
                              ? 'bg-gradient-to-r from-indigo-500 to-rose-500 text-white' 
                              : 'bg-white/10 text-white'
                          }`}>
                            <p>{message.text}</p>
                            {message.attachment && (
                              <div className="mt-2 bg-white/10 rounded p-2 flex items-center gap-2">
                                <div className="p-2 bg-white/10 rounded">
                                  <svg className="h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"></path>
                                    <polyline points="14 2 14 8 20 8"></polyline>
                                  </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-white truncate">{message.attachment.name}</p>
                                  <p className="text-xs text-white/60">{message.attachment.type} • {message.attachment.size}</p>
                                </div>
                                <Button variant="ghost" size="sm" className="text-white/60 hover:text-white hover:bg-white/10">
                                  <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path>
                                    <polyline points="7 10 12 15 17 10"></polyline>
                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                  </svg>
                                </Button>
                              </div>
                            )}
                          </div>
                          <p className={`text-xs text-white/40 mt-1 ${message.sender === 'me' ? 'text-right' : 'text-left'}`}>
                            {message.timestamp}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Message Input */}
                <div className="p-4 border-t border-white/10">
                  <div className="relative flex items-center">
                    <Button variant="ghost" size="icon" className="absolute left-2 text-white/60 hover:text-white hover:bg-white/10">
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                        <line x1="9" y1="9" x2="9.01" y2="9"></line>
                        <line x1="15" y1="9" x2="15.01" y2="9"></line>
                      </svg>
                    </Button>
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute right-2 text-white/60 hover:text-white hover:bg-white/10"
                      onClick={handleSendMessage}
                    >
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                      </svg>
                    </Button>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/10">
                        <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                          <circle cx="8.5" cy="8.5" r="1.5"></circle>
                          <polyline points="21 15 16 10 5 21"></polyline>
                        </svg>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/10">
                        <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path>
                          <polyline points="17 8 12 3 7 8"></polyline>
                          <line x1="12" y1="3" x2="12" y2="15"></line>
                        </svg>
                      </Button>
                    </div>
                    <Button size="sm" className="bg-gradient-to-r from-indigo-500 to-rose-500 hover:from-indigo-600 hover:to-rose-600 text-white">
                      Send
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
                  <MessageSquare className="h-10 w-10 text-white/20" />
                </div>
                <h3 className="text-2xl font-medium text-white mb-2">No conversation selected</h3>
                <p className="text-white/60 max-w-sm">
                  Select a conversation from the list to view messages or start a new conversation.
                </p>
                <Button className="mt-6 bg-gradient-to-r from-indigo-500 to-rose-500 hover:from-indigo-600 hover:to-rose-600 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  New Message
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}