"use client"

import type React from "react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { MoreHorizontal, Download, Send, Paperclip } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface MessageAttachment {
  name: string
  type: string
  size: string
  url: string
}

interface Message {
  id: string
  sender?: {
    name: string
    role?: string
  }
  content: string
  timestamp: string
  attachments?: MessageAttachment[]
}

interface CommunicationLogProps {
  title?: string
  messages: Message[]
  className?: string
}

export default function CommunicationLog({ title = "Communication Log", messages, className }: CommunicationLogProps) {
  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, this would send the message to the server
      console.log("Sending message:", newMessage)
      setNewMessage("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className={cn("bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg", className)}>
      <div className="p-4 border-b border-white/10 flex justify-between items-center">
        <h3 className="text-lg font-medium text-white">{title}</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-white/60 hover:text-white">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white/10 backdrop-blur-lg border-white/10">
            <DropdownMenuItem className="text-white/80 hover:text-white focus:text-white">
              Mark All as Read
            </DropdownMenuItem>
            <DropdownMenuItem className="text-white/80 hover:text-white focus:text-white">
              Export Conversation
            </DropdownMenuItem>
            <DropdownMenuItem className="text-white/80 hover:text-white focus:text-white">
              Archive Conversation
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="p-4 max-h-[300px] overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="flex gap-3">
              {message.sender && (
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-r from-indigo-500/30 to-rose-500/30 flex items-center justify-center">
                  <span className="text-xs font-medium text-white">
                    {message.sender.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
              )}
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    {message.sender && (
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-white">{message.sender.name}</p>
                        {message.sender.role && <span className="text-xs text-white/60">{message.sender.role}</span>}
                      </div>
                    )}
                    <p className="text-sm text-white/90 mt-1">{message.content}</p>
                  </div>
                  <span className="text-xs text-white/40">{message.timestamp}</span>
                </div>

                {message.attachments && message.attachments.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {message.attachments.map((attachment, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 bg-white/5 rounded-md border border-white/10"
                      >
                        <div className="p-1.5 bg-white/10 rounded">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-white/80"
                          >
                            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                            <polyline points="14 2 14 8 20 8" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white/90">{attachment.name}</p>
                          <p className="text-xs text-white/60">
                            {attachment.type} • {attachment.size}
                          </p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-white/60 hover:text-white">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-white/20"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 text-white/60 hover:text-white"
            >
              <Paperclip className="h-4 w-4" />
            </Button>
          </div>
          <Button
            onClick={handleSendMessage}
            className="bg-gradient-to-r from-indigo-500 to-rose-500 hover:from-indigo-600 hover:to-rose-600 text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}