"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  Bell, 
  Lock, 
  Palette, 
  Globe,
  CreditCard,
  Shield,
  Mail,
  Smartphone,
  Key
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"

const notificationSettings = [
  { id: "email", label: "Email Notifications", description: "Receive updates via email", icon: Mail },
  { id: "push", label: "Push Notifications", description: "Browser push notifications", icon: Bell },
  { id: "sms", label: "SMS Alerts", description: "Critical alerts via SMS", icon: Smartphone },
]

const securitySettings = [
  { id: "2fa", label: "Two-Factor Authentication", description: "Add an extra layer of security", icon: Key },
  { id: "sessions", label: "Active Sessions", description: "Manage logged-in devices", icon: Globe },
]

export function SettingsTab() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
  })

  const [security, setSecurity] = useState({
    "2fa": false,
    sessions: true,
  })

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-foreground md:text-3xl" style={{ fontFamily: 'var(--font-display)' }}>
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account preferences and security
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Account Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg" style={{ fontFamily: 'var(--font-display)' }}>
                <Palette className="h-5 w-5 text-primary" />
                Account Settings
              </CardTitle>
              <CardDescription>Update your account information</CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup className="space-y-4">
                <Field>
                  <FieldLabel>Full Name</FieldLabel>
                  <Input 
                    defaultValue="Alex Kim" 
                    className="bg-secondary/50 border-border/50"
                  />
                </Field>
                <Field>
                  <FieldLabel>Email Address</FieldLabel>
                  <Input 
                    type="email" 
                    defaultValue="alex.kim@risklens.io" 
                    className="bg-secondary/50 border-border/50"
                  />
                </Field>
                <Field>
                  <FieldLabel>Company</FieldLabel>
                  <Input 
                    defaultValue="Venture Capital Division" 
                    className="bg-secondary/50 border-border/50"
                  />
                </Field>
                <Field>
                  <FieldLabel>Timezone</FieldLabel>
                  <Input 
                    defaultValue="Pacific Time (PT)" 
                    className="bg-secondary/50 border-border/50"
                  />
                </Field>
              </FieldGroup>
              <Button className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90">
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notification Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg" style={{ fontFamily: 'var(--font-display)' }}>
                <Bell className="h-5 w-5 text-primary" />
                Notifications
              </CardTitle>
              <CardDescription>Configure how you receive updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {notificationSettings.map((setting) => (
                <div
                  key={setting.id}
                  className="flex items-center justify-between rounded-xl border border-border/50 bg-secondary/30 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <setting.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{setting.label}</p>
                      <p className="text-sm text-muted-foreground">{setting.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications[setting.id as keyof typeof notifications]}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, [setting.id]: checked })
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Security Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg" style={{ fontFamily: 'var(--font-display)' }}>
                <Lock className="h-5 w-5 text-primary" />
                Security
              </CardTitle>
              <CardDescription>Manage your security preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {securitySettings.map((setting) => (
                <div
                  key={setting.id}
                  className="flex items-center justify-between rounded-xl border border-border/50 bg-secondary/30 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <setting.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{setting.label}</p>
                      <p className="text-sm text-muted-foreground">{setting.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={security[setting.id as keyof typeof security]}
                    onCheckedChange={(checked) =>
                      setSecurity({ ...security, [setting.id]: checked })
                    }
                  />
                </div>
              ))}
              <Button variant="outline" className="w-full mt-4 border-border/50">
                Change Password
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Billing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg" style={{ fontFamily: 'var(--font-display)' }}>
                <CreditCard className="h-5 w-5 text-primary" />
                Billing & Subscription
              </CardTitle>
              <CardDescription>Manage your subscription plan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      <span className="font-semibold text-foreground">Pro Plan</span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Full access to all features
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
                      $99
                    </p>
                    <p className="text-sm text-muted-foreground">/month</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-3">
                  <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                    Upgrade Plan
                  </Button>
                  <Button variant="outline" className="border-border/50">
                    View Invoices
                  </Button>
                </div>
              </div>

              <div className="mt-4 rounded-lg border border-border/50 bg-secondary/30 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Visa ending in 4242</p>
                      <p className="text-sm text-muted-foreground">Expires 12/2026</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Update
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <Card className="border-danger/30 bg-danger/5">
          <CardHeader>
            <CardTitle className="text-lg text-danger" style={{ fontFamily: 'var(--font-display)' }}>
              Danger Zone
            </CardTitle>
            <CardDescription>
              Irreversible actions that affect your account
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium text-foreground">Delete Account</p>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all associated data
              </p>
            </div>
            <Button variant="destructive">
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
