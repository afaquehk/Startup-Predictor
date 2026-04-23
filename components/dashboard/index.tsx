"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  LayoutDashboard, 
  User, 
  Building2, 
  Settings, 
  Bell, 
  Search,
  LogOut,
  ChevronDown,
  Shield
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DashboardTab } from "./dashboard-tab"
import { ProfileTab } from "./profile-tab"
import { StartupsTab } from "./startups-tab"
import { SettingsTab } from "./settings-tab"
import { StartupSearchDialog } from "@/components/startup-search-dialog"
import type { StartupData } from "@/lib/api"

interface DashboardProps {
  onLogout: () => void
}

type TabType = "dashboard" | "profile" | "startups" | "settings"

const tabs = [
  { id: "dashboard" as const, label: "Dashboard", icon: LayoutDashboard },
  { id: "startups" as const, label: "Startups", icon: Building2 },
  { id: "profile" as const, label: "Profile", icon: User },
  { id: "settings" as const, label: "Settings", icon: Settings },
]

export function Dashboard({ onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard")
  const [searchOpen, setSearchOpen] = useState(false)
  const [selectedStartup, setSelectedStartup] = useState<StartupData | null>(null)

  const handleStartupSelected = (startup: StartupData) => {
    setSelectedStartup(startup)
    console.log("Selected startup:", startup)
    // You can add more logic here, like showing a detail view
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <motion.aside 
        className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-border/50 bg-sidebar lg:flex"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
          <div className="relative">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/20">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-success" />
          </div>
          <span className="text-lg font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
            RiskLens
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {tabs.map((tab, index) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`group relative flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <tab.icon className="h-5 w-5" />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary"
                  layoutId="activeIndicator"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </nav>

        {/* User section */}
        <div className="border-t border-sidebar-border p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3 px-3 py-6 hover:bg-sidebar-accent"
              >
                <Avatar className="h-9 w-9 border-2 border-primary/20">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" />
                  <AvatarFallback className="bg-primary/10 text-primary">AK</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-foreground">Alex Kim</p>
                  <p className="text-xs text-muted-foreground">Analyst</p>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => setActiveTab("profile")}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTab("settings")}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout} className="text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.aside>

      {/* Main content */}
      <div className="flex-1 lg:ml-64">
        {/* Header */}
        <motion.header 
          className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/50 bg-background/80 px-6 backdrop-blur-md"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-3 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/20">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <span className="text-lg font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
              RiskLens
            </span>
          </div>

          {/* Search */}
          <div className="hidden flex-1 lg:block lg:max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search startups, reports..." 
                className="h-10 bg-secondary/50 pl-10 border-border/50 cursor-pointer"
                onClick={() => setSearchOpen(true)}
                readOnly
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />
            </Button>
            <div className="lg:hidden">
              <Avatar className="h-8 w-8 border-2 border-primary/20">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" />
                <AvatarFallback className="bg-primary/10 text-primary">AK</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </motion.header>

        {/* Tab content */}
        <main className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === "dashboard" && <DashboardTab />}
              {activeTab === "profile" && <ProfileTab />}
              {activeTab === "startups" && <StartupsTab />}
              {activeTab === "settings" && <SettingsTab />}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Mobile navigation */}
        <motion.nav 
          className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-border/50 bg-background/95 backdrop-blur-md lg:hidden"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 px-4 py-2 ${
                activeTab === tab.id ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <tab.icon className="h-5 w-5" />
              <span className="text-xs">{tab.label}</span>
            </button>
          ))}
        </motion.nav>
      </div>

      {/* Startup Search Dialog */}
      <StartupSearchDialog
        open={searchOpen}
        onOpenChange={setSearchOpen}
        onStartupSelected={handleStartupSelected}
      />
    </div>
  )
}
