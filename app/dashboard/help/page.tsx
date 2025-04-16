"use client"

import { useState } from "react"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { HelpCircle, Search, FileText, MessageSquare, Video, ExternalLink, Mail, Phone } from "lucide-react"
import Image from "next/image"

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Mock help articles
  const helpArticles = [
    {
      id: 1,
      title: "Getting Started with Import Management",
      category: "Getting Started",
      excerpt: "Learn the basics of managing your imports through our platform.",
      readTime: "5 min read",
    },
    {
      id: 2,
      title: "Understanding Customs Documentation",
      category: "Documentation",
      excerpt: "A comprehensive guide to customs documentation requirements.",
      readTime: "8 min read",
    },
    {
      id: 3,
      title: "Tracking Your Shipments",
      category: "Shipping",
      excerpt: "How to track your shipments in real-time using our platform.",
      readTime: "4 min read",
    },
    {
      id: 4,
      title: "Managing Team Permissions",
      category: "Account Management",
      excerpt: "Learn how to set up and manage permissions for your team members.",
      readTime: "6 min read",
    },
    {
      id: 5,
      title: "Importing from Restricted Countries",
      category: "Compliance",
      excerpt: "Guidelines for importing from countries with trade restrictions.",
      readTime: "10 min read",
    },
    {
      id: 6,
      title: "Setting Up Two-Factor Authentication",
      category: "Security",
      excerpt: "Enhance your account security with two-factor authentication.",
      readTime: "3 min read",
    },
  ]

  // Mock video tutorials
  const videoTutorials = [
    {
      id: 1,
      title: "Dashboard Overview",
      thumbnail: "/placeholder.svg?height=200&width=300",
      duration: "4:30",
    },
    {
      id: 2,
      title: "Creating Your First Import",
      thumbnail: "/placeholder.svg?height=200&width=300",
      duration: "6:15",
    },
    {
      id: 3,
      title: "Managing Documents",
      thumbnail: "/placeholder.svg?height=200&width=300",
      duration: "5:45",
    },
    {
      id: 4,
      title: "Financial Tracking",
      thumbnail: "/placeholder.svg?height=200&width=300",
      duration: "7:20",
    },
  ]

  // Filter help articles based on search
  const filteredArticles = helpArticles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-white">Help & Support</h1>
            <p className="text-white/60">Find answers and get assistance with your import operations</p>
          </div>
          <div className="flex items-center gap-3">
            <Button className="bg-gradient-to-r from-indigo-500 to-rose-500 hover:from-indigo-600 hover:to-rose-600 text-white">
              <MessageSquare className="h-4 w-4 mr-2" />
              Contact Support
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 mb-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-medium text-white text-center mb-2">How can we help you today?</h2>
          <p className="text-white/60 text-center mb-6">Search our knowledge base for answers to common questions</p>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
            <Input
              placeholder="Search for help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40 h-12"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <Button
              variant="outline"
              className="flex flex-col items-center gap-2 h-auto py-4 border-white/10 text-white/80 hover:bg-white/5"
            >
              <FileText className="h-6 w-6" />
              <span>Documentation</span>
            </Button>

            <Button
              variant="outline"
              className="flex flex-col items-center gap-2 h-auto py-4 border-white/10 text-white/80 hover:bg-white/5"
            >
              <Video className="h-6 w-6" />
              <span>Tutorials</span>
            </Button>

            <Button
              variant="outline"
              className="flex flex-col items-center gap-2 h-auto py-4 border-white/10 text-white/80 hover:bg-white/5"
            >
              <MessageSquare className="h-6 w-6" />
              <span>Live Chat</span>
            </Button>

            <Button
              variant="outline"
              className="flex flex-col items-center gap-2 h-auto py-4 border-white/10 text-white/80 hover:bg-white/5"
            >
              <Mail className="h-6 w-6" />
              <span>Email Support</span>
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="articles" className="space-y-6">
        <TabsList className="bg-white/5 border-white/10">
          <TabsTrigger
            value="articles"
            className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60"
          >
            <FileText className="h-4 w-4 mr-2" />
            Help Articles
          </TabsTrigger>
          <TabsTrigger
            value="videos"
            className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60"
          >
            <Video className="h-4 w-4 mr-2" />
            Video Tutorials
          </TabsTrigger>
          <TabsTrigger
            value="contact"
            className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Contact Support
          </TabsTrigger>
          <TabsTrigger
            value="faq"
            className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60"
          >
            <HelpCircle className="h-4 w-4 mr-2" />
            FAQ
          </TabsTrigger>
        </TabsList>

        <TabsContent value="articles" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredArticles.length > 0 ? (
              filteredArticles.map((article) => (
                <div
                  key={article.id}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 hover:bg-white/[0.07] transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <span className="inline-block px-2 py-1 text-xs rounded-full bg-white/10 text-white/70 mb-2">
                      {article.category}
                    </span>
                    <span className="text-white/40 text-xs">{article.readTime}</span>
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">{article.title}</h3>
                  <p className="text-white/60 text-sm mb-4">{article.excerpt}</p>
                  <Button variant="ghost" size="sm" className="text-indigo-400 hover:text-indigo-300 p-0 h-auto">
                    Read Article <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                  <FileText className="h-8 w-8 text-white/20" />
                </div>
                <h3 className="text-xl font-medium text-white mb-2">No articles found</h3>
                <p className="text-white/60 max-w-md">
                  We couldnt find any articles matching your search. Try using different keywords or browse our
                  categories.
                </p>
              </div>
            )}
          </div>

          {filteredArticles.length > 0 && (
            <div className="flex justify-center mt-4">
              <Button variant="outline" className="border-white/10 text-white/80 hover:bg-white/5">
                View All Articles
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="videos" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {videoTutorials.map((video) => (
              <div
                key={video.id}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden hover:bg-white/[0.07] transition-colors cursor-pointer"
              >
                <div className="relative">
                  <Image src={video.thumbnail || "/placeholder.svg"} alt={video.title} className="w-full h-auto" />
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-12 w-12 rounded-full bg-black/50 flex items-center justify-center">
                      <div className="h-10 w-10 rounded-full bg-white/90 flex items-center justify-center">
                        <div className="w-0 h-0 border-y-[6px] border-y-transparent border-l-[10px] border-l-black ml-1"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-white font-medium">{video.title}</h3>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-4">
            <Button variant="outline" className="border-white/10 text-white/80 hover:bg-white/5">
              View All Tutorials
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
                <h3 className="text-lg font-medium text-white mb-4">Contact Support</h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-white/70 block">
                      Subject
                    </label>
                    <Input
                      id="subject"
                      placeholder="What can we help you with?"
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-white/70 block">
                        Your Name
                      </label>
                      <Input id="name" placeholder="John Smith" className="bg-white/5 border-white/10 text-white" />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="email" className="text-white/70 block">
                        Email Address
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-white/70 block">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      placeholder="Please describe your issue in detail..."
                      className="bg-white/5 border-white/10 text-white min-h-[150px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="attachments" className="text-white/70 block">
                      Attachments (Optional)
                    </label>
                    <Input
                      id="attachments"
                      type="file"
                      className="bg-white/5 border-white/10 text-white file:bg-white/10 file:text-white file:border-0"
                    />
                    <p className="text-white/40 text-xs">Max file size: 10MB. Supported formats: JPG, PNG, PDF</p>
                  </div>

                  <Button className="bg-gradient-to-r from-indigo-500 to-rose-500 hover:from-indigo-600 hover:to-rose-600 text-white">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Submit Support Request
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
                <h3 className="text-lg font-medium text-white mb-4">Contact Information</h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-indigo-400 mt-0.5" />
                    <div>
                      <p className="text-white/90 font-medium">Email Support</p>
                      <a
                        href="mailto:support@globalreach.com"
                        className="text-white/70 hover:text-white/90 transition-colors"
                      >
                        support@globalreach.com
                      </a>
                      <p className="text-white/60 text-sm mt-1">Response time: 24 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-indigo-400 mt-0.5" />
                    <div>
                      <p className="text-white/90 font-medium">Phone Support</p>
                      <a href="tel:+15551234567" className="text-white/70 hover:text-white/90 transition-colors">
                        +1 (555) 123-4567
                      </a>
                      <p className="text-white/60 text-sm mt-1">Mon-Fri, 9AM-5PM EST</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MessageSquare className="h-5 w-5 text-indigo-400 mt-0.5" />
                    <div>
                      <p className="text-white/90 font-medium">Live Chat</p>
                      <p className="text-white/70">Available for Premium and Enterprise customers</p>
                      <p className="text-white/60 text-sm mt-1">24/7 Support</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-white/10">
                  <h4 className="text-white/90 font-medium mb-2">Support Hours</h4>
                  <p className="text-white/70">Monday - Friday: 9AM - 8PM EST</p>
                  <p className="text-white/70">Saturday: 10AM - 5PM EST</p>
                  <p className="text-white/70">Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="faq" className="space-y-6 mt-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
            <h3 className="text-lg font-medium text-white mb-4">Frequently Asked Questions</h3>

            <div className="space-y-4">
              <div className="bg-white/[0.03] p-4 rounded-md">
                <h4 className="text-white/90 font-medium mb-2">What is Global Reach Solutions?</h4>
                <p className="text-white/70">
                  Global Reach Solutions is an international product redirection service that helps individuals and
                  businesses access products from retailers worldwide that dont offer direct international shipping. We
                  provide you with local addresses in multiple countries, receive your packages, and forward them to
                  your location anywhere in the world.
                </p>
              </div>

              <div className="bg-white/[0.03] p-4 rounded-md">
                <h4 className="text-white/90 font-medium mb-2">How do I track my shipments?</h4>
                <p className="text-white/70">
                  You can track all your shipments in real-time through your dashboard. Once your package is shipped,
                  youll receive a tracking number and link via email. You can also log into your account to view
                  detailed status updates throughout the delivery process.
                </p>
              </div>

              <div className="bg-white/[0.03] p-4 rounded-md">
                <h4 className="text-white/90 font-medium mb-2">What are the shipping costs?</h4>
                <p className="text-white/70">
                  Shipping costs are calculated based on the dimensional weight of your package (the greater of actual
                  weight or volume-based weight), the destination country, and your chosen shipping method. You can use
                  our shipping calculator to estimate costs before making purchases.
                </p>
              </div>

              <div className="bg-white/[0.03] p-4 rounded-md">
                <h4 className="text-white/90 font-medium mb-2">How are customs duties and taxes handled?</h4>
                <p className="text-white/70">
                  Import duties and taxes are determined by your countrys customs authorities and are typically based
                  on the value and type of items. We provide estimated duty and tax calculations before shipping, and
                  you can choose to pre-pay these fees or pay upon delivery, depending on the destination country.
                </p>
              </div>

              <div className="bg-white/[0.03] p-4 rounded-md">
                <h4 className="text-white/90 font-medium mb-2">Can I consolidate multiple packages?</h4>
                <p className="text-white/70">
                  Yes! Our package consolidation service allows you to combine multiple packages into a single shipment,
                  potentially saving significant costs on international shipping. Well hold your packages for up to 30
                  days at no extra charge while waiting for all items to arrive.
                </p>
              </div>

              <div className="bg-white/[0.03] p-4 rounded-md">
                <h4 className="text-white/90 font-medium mb-2">What items are prohibited?</h4>
                <p className="text-white/70">
                  Prohibited items vary by country but generally include perishables, hazardous materials, weapons, and
                  counterfeit goods. We provide a comprehensive list of prohibited items for each destination country,
                  and our team can help determine if your items are eligible for shipping.
                </p>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-white/70 mb-4">Cant find what youre looking for?</p>
              <Button className="bg-gradient-to-r from-indigo-500 to-rose-500 hover:from-indigo-600 hover:to-rose-600 text-white">
                <MessageSquare className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}

