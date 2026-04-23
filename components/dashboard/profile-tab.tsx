"use client"

import { motion } from "framer-motion"
import { 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  Calendar,
  Award,
  TrendingUp,
  FileText,
  Edit2
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const skills = [
  { name: "Financial Analysis", level: 92 },
  { name: "Market Research", level: 88 },
  { name: "Risk Assessment", level: 95 },
  { name: "Due Diligence", level: 85 },
]

const achievements = [
  { title: "Top Analyst Q4", icon: Award, description: "Highest accuracy rate" },
  { title: "100 Reports", icon: FileText, description: "Completed milestone" },
  { title: "Risk Expert", icon: TrendingUp, description: "Advanced certification" },
]

const recentActivity = [
  { action: "Completed risk analysis", target: "TechFlow AI", time: "2 hours ago" },
  { action: "Updated report", target: "HealthBridge", time: "5 hours ago" },
  { action: "New startup added", target: "EcoSolutions", time: "1 day ago" },
  { action: "Due diligence review", target: "FinanceHub", time: "2 days ago" },
]

export function ProfileTab() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-foreground md:text-3xl" style={{ fontFamily: 'var(--font-display)' }}>
          Profile
        </h1>
        <p className="text-muted-foreground">
          Manage your account and view your analytics
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  <Avatar className="h-24 w-24 border-4 border-primary/20">
                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" />
                    <AvatarFallback className="bg-primary/10 text-2xl text-primary">AK</AvatarFallback>
                  </Avatar>
                  <button className="absolute -right-1 bottom-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground transition-colors hover:bg-primary/90">
                    <Edit2 className="h-4 w-4" />
                  </button>
                </div>
                <h2 className="mt-4 text-xl font-semibold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
                  Alex Kim
                </h2>
                <p className="text-muted-foreground">Senior Risk Analyst</p>
                <div className="mt-3 flex gap-2">
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    Pro Member
                  </Badge>
                  <Badge variant="secondary" className="bg-success/10 text-success">
                    Verified
                  </Badge>
                </div>

                <div className="mt-6 w-full space-y-3">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    alex.kim@risklens.io
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    +1 (555) 123-4567
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    San Francisco, CA
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Building2 className="h-4 w-4" />
                    Venture Capital Division
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Joined March 2023
                  </div>
                </div>

                <Button className="mt-6 w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Skills & Achievements */}
        <motion.div
          className="space-y-6 lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {/* Skills */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg" style={{ fontFamily: 'var(--font-display)' }}>
                Expertise Areas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                {skills.map((skill, index) => (
                  <motion.div
                    key={skill.name}
                    className="space-y-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">{skill.name}</span>
                      <span className="text-sm text-primary">{skill.level}%</span>
                    </div>
                    <Progress value={skill.level} className="h-2 [&>div]:bg-primary" />
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg" style={{ fontFamily: 'var(--font-display)' }}>
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.title}
                    className="flex flex-col items-center rounded-xl border border-border/50 bg-secondary/30 p-4 text-center transition-all hover:border-primary/30"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <achievement.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mt-3 font-medium text-foreground">{achievement.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{achievement.description}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg" style={{ fontFamily: 'var(--font-display)' }}>
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-4 rounded-lg border border-border/30 bg-secondary/20 p-4 transition-all hover:border-primary/20"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-foreground">
                      <span className="font-medium">{activity.action}</span>
                      {" for "}
                      <span className="text-primary">{activity.target}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
