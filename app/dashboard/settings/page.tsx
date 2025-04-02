"use client"

import type React from "react"

import { useState } from "react"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { User, Lock, Bell, Globe, CreditCard, Shield, Save } from "lucide-react"
import Image from "next/image"

export default function SettingsPage() {
  // Profile settings state
  const [profileForm, setProfileForm] = useState({
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@example.com",
    phone: "+1 (555) 123-4567",
    jobTitle: "Import Manager",
    company: "Global Imports Inc.",
    bio: "Experienced import manager with over 10 years in international logistics and supply chain management.",
  })

  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    importUpdates: true,
    documentAlerts: true,
    financialAlerts: true,
    teamUpdates: false,
    marketingEmails: false,
  })

  // Security settings state
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    loginNotifications: true,
    sessionTimeout: "30",
  })

  // Handle profile form changes
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle notification toggle changes
  const handleNotificationToggle = (setting: string) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev],
    }))
  }

  // Handle security toggle changes
  const handleSecurityToggle = (setting: string) => {
    setSecuritySettings((prev) => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev],
    }))
  }

  // Handle session timeout change
  const handleSessionTimeoutChange = (value: string) => {
    setSecuritySettings((prev) => ({
      ...prev,
      sessionTimeout: value,
    }))
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-white">Settings</h1>
            <p className="text-white/60">Manage your account preferences and settings</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-white/5 border-white/10">
          <TabsTrigger
            value="profile"
            className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60"
          >
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60"
          >
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60"
          >
            <Lock className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger
            value="preferences"
            className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60"
          >
            <Globe className="h-4 w-4 mr-2" />
            Preferences
          </TabsTrigger>
          <TabsTrigger
            value="billing"
            className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Billing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6 mt-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
            <h3 className="text-lg font-medium text-white mb-4">Profile Information</h3>

            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/3 flex flex-col items-center">
                <div className="relative mb-4">
                  <Image
                    src="/placeholder.svg?height=200&width=200"
                    alt="Profile"
                    width={150}
                    height={150}
                    className="rounded-full"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute bottom-0 right-0 border-white/10 text-white/80 hover:bg-white/5 rounded-full"
                  >
                    Change
                  </Button>
                </div>
                <p className="text-white/60 text-sm text-center">Upload a profile picture (JPG or PNG, max 2MB)</p>
              </div>

              <div className="md:w-2/3 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-white/70">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={profileForm.firstName}
                      onChange={handleProfileChange}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-white/70">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={profileForm.lastName}
                      onChange={handleProfileChange}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white/70">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={profileForm.email}
                    onChange={handleProfileChange}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-white/70">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={profileForm.phone}
                    onChange={handleProfileChange}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle" className="text-white/70">
                      Job Title
                    </Label>
                    <Input
                      id="jobTitle"
                      name="jobTitle"
                      value={profileForm.jobTitle}
                      onChange={handleProfileChange}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-white/70">
                      Company
                    </Label>
                    <Input
                      id="company"
                      name="company"
                      value={profileForm.company}
                      onChange={handleProfileChange}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-white/70">
                    Bio
                  </Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={profileForm.bio}
                    onChange={handleProfileChange}
                    className="bg-white/5 border-white/10 text-white min-h-[100px]"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button className="bg-gradient-to-r from-indigo-500 to-rose-500 hover:from-indigo-600 hover:to-rose-600 text-white">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6 mt-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
            <h3 className="text-lg font-medium text-white mb-4">Notification Preferences</h3>

            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-white/90 font-medium">Delivery Methods</h4>

                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <Label className="text-white/80">Email Notifications</Label>
                    <p className="text-white/60 text-sm">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={() => handleNotificationToggle("emailNotifications")}
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <Label className="text-white/80">Push Notifications</Label>
                    <p className="text-white/60 text-sm">Receive notifications in your browser</p>
                  </div>
                  <Switch
                    checked={notificationSettings.pushNotifications}
                    onCheckedChange={() => handleNotificationToggle("pushNotifications")}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 space-y-4">
                <h4 className="text-white/90 font-medium">Notification Types</h4>

                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <Label className="text-white/80">Import Updates</Label>
                    <p className="text-white/60 text-sm">Status changes and updates for your imports</p>
                  </div>
                  <Switch
                    checked={notificationSettings.importUpdates}
                    onCheckedChange={() => handleNotificationToggle("importUpdates")}
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <Label className="text-white/80">Document Alerts</Label>
                    <p className="text-white/60 text-sm">Notifications about document uploads and requirements</p>
                  </div>
                  <Switch
                    checked={notificationSettings.documentAlerts}
                    onCheckedChange={() => handleNotificationToggle("documentAlerts")}
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <Label className="text-white/80">Financial Alerts</Label>
                    <p className="text-white/60 text-sm">
                      Notifications about payments, invoices, and financial updates
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.financialAlerts}
                    onCheckedChange={() => handleNotificationToggle("financialAlerts")}
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <Label className="text-white/80">Team Updates</Label>
                    <p className="text-white/60 text-sm">Notifications about team member activities</p>
                  </div>
                  <Switch
                    checked={notificationSettings.teamUpdates}
                    onCheckedChange={() => handleNotificationToggle("teamUpdates")}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 space-y-4">
                <h4 className="text-white/90 font-medium">Marketing Communications</h4>

                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <Label className="text-white/80">Marketing Emails</Label>
                    <p className="text-white/60 text-sm">Receive updates about new features and promotions</p>
                  </div>
                  <Switch
                    checked={notificationSettings.marketingEmails}
                    onCheckedChange={() => handleNotificationToggle("marketingEmails")}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button className="bg-gradient-to-r from-indigo-500 to-rose-500 hover:from-indigo-600 hover:to-rose-600 text-white">
                <Save className="h-4 w-4 mr-2" />
                Save Preferences
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6 mt-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
            <h3 className="text-lg font-medium text-white mb-4">Security Settings</h3>

            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-white/90 font-medium">Password</h4>

                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="text-white/70">
                    Current Password
                  </Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    placeholder="••••••••"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-white/70">
                      New Password
                    </Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="••••••••"
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-white/70">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button variant="outline" className="border-white/10 text-white/80 hover:bg-white/5">
                    Change Password
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 space-y-4">
                <h4 className="text-white/90 font-medium">Two-Factor Authentication</h4>

                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <Label className="text-white/80">Enable Two-Factor Authentication</Label>
                    <p className="text-white/60 text-sm">Add an extra layer of security to your account</p>
                  </div>
                  <Switch
                    checked={securitySettings.twoFactorAuth}
                    onCheckedChange={() => handleSecurityToggle("twoFactorAuth")}
                  />
                </div>

                {securitySettings.twoFactorAuth && (
                  <div className="bg-white/[0.03] p-4 rounded-md">
                    <p className="text-white/70 mb-2">Two-factor authentication is enabled.</p>
                    <Button variant="outline" size="sm" className="border-white/10 text-white/80 hover:bg-white/5">
                      Configure 2FA
                    </Button>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-white/10 space-y-4">
                <h4 className="text-white/90 font-medium">Login Security</h4>

                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <Label className="text-white/80">Login Notifications</Label>
                    <p className="text-white/60 text-sm">Receive notifications for new login attempts</p>
                  </div>
                  <Switch
                    checked={securitySettings.loginNotifications}
                    onCheckedChange={() => handleSecurityToggle("loginNotifications")}
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <Label className="text-white/80">Session Timeout</Label>
                    <p className="text-white/60 text-sm">Automatically log out after a period of inactivity</p>
                  </div>
                  <Select value={securitySettings.sessionTimeout} onValueChange={handleSessionTimeoutChange}>
                    <SelectTrigger className="w-[120px] bg-white/5 border-white/10 text-white/80">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/10 backdrop-blur-lg border-white/10">
                      <SelectItem value="15" className="text-white/80 hover:text-white focus:text-white">
                        15 minutes
                      </SelectItem>
                      <SelectItem value="30" className="text-white/80 hover:text-white focus:text-white">
                        30 minutes
                      </SelectItem>
                      <SelectItem value="60" className="text-white/80 hover:text-white focus:text-white">
                        1 hour
                      </SelectItem>
                      <SelectItem value="120" className="text-white/80 hover:text-white focus:text-white">
                        2 hours
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button className="bg-gradient-to-r from-indigo-500 to-rose-500 hover:from-indigo-600 hover:to-rose-600 text-white">
                <Shield className="h-4 w-4 mr-2" />
                Save Security Settings
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6 mt-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
            <h3 className="text-lg font-medium text-white mb-4">System Preferences</h3>

            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-white/90 font-medium">Language & Region</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="language" className="text-white/70">
                      Language
                    </Label>
                    <Select defaultValue="en">
                      <SelectTrigger id="language" className="bg-white/5 border-white/10 text-white/80">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent className="bg-white/10 backdrop-blur-lg border-white/10">
                        <SelectItem value="en" className="text-white/80 hover:text-white focus:text-white">
                          English
                        </SelectItem>
                        <SelectItem value="es" className="text-white/80 hover:text-white focus:text-white">
                          Spanish
                        </SelectItem>
                        <SelectItem value="fr" className="text-white/80 hover:text-white focus:text-white">
                          French
                        </SelectItem>
                        <SelectItem value="de" className="text-white/80 hover:text-white focus:text-white">
                          German
                        </SelectItem>
                        <SelectItem value="zh" className="text-white/80 hover:text-white focus:text-white">
                          Chinese
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone" className="text-white/70">
                      Time Zone
                    </Label>
                    <Select defaultValue="utc-8">
                      <SelectTrigger id="timezone" className="bg-white/5 border-white/10 text-white/80">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent className="bg-white/10 backdrop-blur-lg border-white/10">
                        <SelectItem value="utc-8" className="text-white/80 hover:text-white focus:text-white">
                          Pacific Time (UTC-8)
                        </SelectItem>
                        <SelectItem value="utc-5" className="text-white/80 hover:text-white focus:text-white">
                          Eastern Time (UTC-5)
                        </SelectItem>
                        <SelectItem value="utc+0" className="text-white/80 hover:text-white focus:text-white">
                          GMT (UTC+0)
                        </SelectItem>
                        <SelectItem value="utc+1" className="text-white/80 hover:text-white focus:text-white">
                          Central European Time (UTC+1)
                        </SelectItem>
                        <SelectItem value="utc+8" className="text-white/80 hover:text-white focus:text-white">
                          China Standard Time (UTC+8)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateFormat" className="text-white/70">
                    Date Format
                  </Label>
                  <Select defaultValue="mdy">
                    <SelectTrigger id="dateFormat" className="bg-white/5 border-white/10 text-white/80">
                      <SelectValue placeholder="Select date format" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/10 backdrop-blur-lg border-white/10">
                      <SelectItem value="mdy" className="text-white/80 hover:text-white focus:text-white">
                        MM/DD/YYYY
                      </SelectItem>
                      <SelectItem value="dmy" className="text-white/80 hover:text-white focus:text-white">
                        DD/MM/YYYY
                      </SelectItem>
                      <SelectItem value="ymd" className="text-white/80 hover:text-white focus:text-white">
                        YYYY/MM/DD
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 space-y-4">
                <h4 className="text-white/90 font-medium">Theme & Appearance</h4>

                <div className="space-y-2">
                  <Label htmlFor="theme" className="text-white/70">
                    Theme
                  </Label>
                  <Select defaultValue="dark">
                    <SelectTrigger id="theme" className="bg-white/5 border-white/10 text-white/80">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/10 backdrop-blur-lg border-white/10">
                      <SelectItem value="dark" className="text-white/80 hover:text-white focus:text-white">
                        Dark
                      </SelectItem>
                      <SelectItem value="light" className="text-white/80 hover:text-white focus:text-white">
                        Light
                      </SelectItem>
                      <SelectItem value="system" className="text-white/80 hover:text-white focus:text-white">
                        System Default
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <Label className="text-white/80">Reduce Animations</Label>
                    <p className="text-white/60 text-sm">Minimize motion effects throughout the interface</p>
                  </div>
                  <Switch defaultChecked={false} />
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <Label className="text-white/80">High Contrast Mode</Label>
                    <p className="text-white/60 text-sm">Increase contrast for better visibility</p>
                  </div>
                  <Switch defaultChecked={false} />
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button className="bg-gradient-to-r from-indigo-500 to-rose-500 hover:from-indigo-600 hover:to-rose-600 text-white">
                <Save className="h-4 w-4 mr-2" />
                Save Preferences
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6 mt-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
            <h3 className="text-lg font-medium text-white mb-4">Billing Information</h3>

            <div className="space-y-6">
              <div className="bg-gradient-to-r from-indigo-500/10 to-rose-500/10 border border-white/10 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-white/90 font-medium">Current Plan</h4>
                    <p className="text-white/60">Business Pro</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/90 font-medium">$99.99/month</p>
                    <p className="text-white/60 text-sm">Next billing date: Nov 15, 2023</p>
                  </div>
                </div>

                <div className="flex gap-3 mt-4">
                  <Button variant="outline" className="border-white/10 text-white/80 hover:bg-white/5">
                    Change Plan
                  </Button>
                  <Button variant="outline" className="border-white/10 text-white/80 hover:bg-white/5">
                    View Invoice History
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-white/90 font-medium">Payment Method</h4>

                <div className="bg-white/[0.03] p-4 rounded-md flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/5 rounded">
                      <CreditCard className="h-5 w-5 text-white/60" />
                    </div>
                    <div>
                      <p className="text-white/90">Visa ending in 4242</p>
                      <p className="text-white/60 text-sm">Expires 12/2025</p>
                    </div>
                  </div>
                  <Button variant="ghost" className="text-white/60 hover:text-white">
                    Edit
                  </Button>
                </div>

                <Button variant="outline" className="border-white/10 text-white/80 hover:bg-white/5">
                  Add Payment Method
                </Button>
              </div>

              <div className="space-y-4">
                <h4 className="text-white/90 font-medium">Billing Address</h4>

                <div className="bg-white/[0.03] p-4 rounded-md">
                  <p className="text-white/90">Global Imports Inc.</p>
                  <p className="text-white/70">123 Business Ave, Suite 400</p>
                  <p className="text-white/70">San Francisco, CA 94107</p>
                  <p className="text-white/70">United States</p>

                  <Button variant="ghost" className="text-white/60 hover:text-white mt-2">
                    Edit Address
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 space-y-4">
                <h4 className="text-white/90 font-medium">Billing History</h4>

                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 bg-white/[0.03] rounded-md">
                    <div>
                      <p className="text-white/90">Invoice #INV-2023-0042</p>
                      <p className="text-white/60 text-sm">Oct 15, 2023</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white/90">$99.99</p>
                      <p className="text-green-400 text-sm">Paid</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-white/[0.03] rounded-md">
                    <div>
                      <p className="text-white/90">Invoice #INV-2023-0035</p>
                      <p className="text-white/60 text-sm">Sep 15, 2023</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white/90">$99.99</p>
                      <p className="text-green-400 text-sm">Paid</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-white/[0.03] rounded-md">
                    <div>
                      <p className="text-white/90">Invoice #INV-2023-0028</p>
                      <p className="text-white/60 text-sm">Aug 15, 2023</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white/90">$99.99</p>
                      <p className="text-green-400 text-sm">Paid</p>
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="border-white/10 text-white/80 hover:bg-white/5">
                  View All Invoices
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}