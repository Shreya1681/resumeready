"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Volume2,
  Camera,
  Save,
  Trash2,
  Download,
  Moon,
  Sun,
  Monitor
} from "lucide-react"
import { useTheme } from "next-themes"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [isLoading, setIsLoading] = useState(false)
  
  // Profile settings
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA"
  })

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    interviewReminders: true,
    weeklyDigest: false,
    marketingEmails: false
  })

  // Interview settings
  const [interviewSettings, setInterviewSettings] = useState({
    defaultDifficulty: "medium",
    autoRecord: true,
    showTimer: true,
    soundEffects: true
  })

  // Privacy settings
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    shareResults: false,
    allowAnalytics: true
  })

  const handleSaveProfile = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
    toast.success("Profile updated successfully")
  }

  const handleExportData = () => {
    toast.success("Your data export has been initiated. You will receive an email shortly.")
  }

  const handleDeleteAccount = () => {
    toast.error("Account deletion requires email confirmation. Check your inbox.")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Settings
              </CardTitle>
              <CardDescription>
                Update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="/placeholder-avatar.jpg" />
                  <AvatarFallback className="text-lg">JD</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Camera className="h-4 w-4" />
                    Change Photo
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG or GIF. Max 2MB.
                  </p>
                </div>
              </div>

              <Separator />

              {/* Form Fields */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  />
                </div>
              </div>

              <Button onClick={handleSaveProfile} disabled={isLoading} className="gap-2">
                <Save className="h-4 w-4" />
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>

          {/* Interview Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="h-5 w-5" />
                Interview Preferences
              </CardTitle>
              <CardDescription>
                Customize your interview experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Default Difficulty Level</Label>
                <Select
                  value={interviewSettings.defaultDifficulty}
                  onValueChange={(value) => 
                    setInterviewSettings({ ...interviewSettings, defaultDifficulty: value })
                  }
                >
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-Record Sessions</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically record video during interviews
                    </p>
                  </div>
                  <Switch
                    checked={interviewSettings.autoRecord}
                    onCheckedChange={(checked) =>
                      setInterviewSettings({ ...interviewSettings, autoRecord: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Timer</Label>
                    <p className="text-sm text-muted-foreground">
                      Display countdown timer during interviews
                    </p>
                  </div>
                  <Switch
                    checked={interviewSettings.showTimer}
                    onCheckedChange={(checked) =>
                      setInterviewSettings({ ...interviewSettings, showTimer: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Sound Effects</Label>
                    <p className="text-sm text-muted-foreground">
                      Play sounds for timer warnings and notifications
                    </p>
                  </div>
                  <Switch
                    checked={interviewSettings.soundEffects}
                    onCheckedChange={(checked) =>
                      setInterviewSettings({ ...interviewSettings, soundEffects: checked })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>
                Manage how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive important updates via email
                  </p>
                </div>
                <Switch
                  checked={notifications.emailNotifications}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, emailNotifications: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Interview Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Get reminded about scheduled practice sessions
                  </p>
                </div>
                <Switch
                  checked={notifications.interviewReminders}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, interviewReminders: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Weekly Digest</Label>
                  <p className="text-sm text-muted-foreground">
                    Weekly summary of your progress
                  </p>
                </div>
                <Switch
                  checked={notifications.weeklyDigest}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, weeklyDigest: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Marketing Emails</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive news about new features and offers
                  </p>
                </div>
                <Switch
                  checked={notifications.marketingEmails}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, marketingEmails: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy & Security
              </CardTitle>
              <CardDescription>
                Control your privacy and data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Public Profile</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow others to see your profile
                  </p>
                </div>
                <Switch
                  checked={privacy.profileVisible}
                  onCheckedChange={(checked) =>
                    setPrivacy({ ...privacy, profileVisible: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Share Interview Results</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow recruiters to view your results
                  </p>
                </div>
                <Switch
                  checked={privacy.shareResults}
                  onCheckedChange={(checked) =>
                    setPrivacy({ ...privacy, shareResults: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Usage Analytics</Label>
                  <p className="text-sm text-muted-foreground">
                    Help us improve by sharing usage data
                  </p>
                </div>
                <Switch
                  checked={privacy.allowAnalytics}
                  onCheckedChange={(checked) =>
                    setPrivacy({ ...privacy, allowAnalytics: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Appearance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance
              </CardTitle>
              <CardDescription>
                Customize the look and feel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Theme</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    size="sm"
                    className="gap-1"
                    onClick={() => setTheme("light")}
                  >
                    <Sun className="h-4 w-4" />
                    Light
                  </Button>
                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    size="sm"
                    className="gap-1"
                    onClick={() => setTheme("dark")}
                  >
                    <Moon className="h-4 w-4" />
                    Dark
                  </Button>
                  <Button
                    variant={theme === "system" ? "default" : "outline"}
                    size="sm"
                    className="gap-1"
                    onClick={() => setTheme("system")}
                  >
                    <Monitor className="h-4 w-4" />
                    Auto
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Plan Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Current Plan</span>
                <Badge>Free</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Interviews</span>
                  <span>3 / 5 this month</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Resume Uploads</span>
                  <span>1 / 2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">AI Analysis</span>
                  <span>Basic</span>
                </div>
              </div>
              <Button className="w-full">Upgrade to Pro</Button>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Data Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full gap-2"
                onClick={handleExportData}
              >
                <Download className="h-4 w-4" />
                Export My Data
              </Button>
              <Button 
                variant="destructive" 
                className="w-full gap-2"
                onClick={handleDeleteAccount}
              >
                <Trash2 className="h-4 w-4" />
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
