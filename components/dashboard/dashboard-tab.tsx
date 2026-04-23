"use client"

import { motion } from "framer-motion"
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2,
  ArrowUpRight,
  Building2,
  DollarSign,
  Users,
  Activity
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const areaData = [
  { month: "Jan", low: 12, medium: 8, high: 3 },
  { month: "Feb", low: 15, medium: 10, high: 5 },
  { month: "Mar", low: 18, medium: 7, high: 4 },
  { month: "Apr", low: 22, medium: 9, high: 2 },
  { month: "May", low: 25, medium: 12, high: 6 },
  { month: "Jun", low: 28, medium: 8, high: 3 },
]

const pieData = [
  { name: "Low Risk", value: 45, color: "oklch(0.70 0.18 145)" },
  { name: "Medium Risk", value: 35, color: "oklch(0.78 0.18 85)" },
  { name: "High Risk", value: 20, color: "oklch(0.55 0.22 25)" },
]

const recentStartups = [
  { name: "TechFlow AI", sector: "AI/ML", risk: 28, status: "low", funding: "$12M" },
  { name: "HealthBridge", sector: "HealthTech", risk: 45, status: "medium", funding: "$8M" },
  { name: "FinanceHub", sector: "FinTech", risk: 72, status: "high", funding: "$25M" },
  { name: "EcoSolutions", sector: "CleanTech", risk: 35, status: "low", funding: "$5M" },
]

const statsCards = [
  { 
    title: "Total Startups", 
    value: "128", 
    change: "+12%", 
    trend: "up",
    icon: Building2,
    color: "text-primary" 
  },
  { 
    title: "Total Funding Analyzed", 
    value: "$2.4B", 
    change: "+8%", 
    trend: "up",
    icon: DollarSign,
    color: "text-success" 
  },
  { 
    title: "Avg Risk Score", 
    value: "42", 
    change: "-5%", 
    trend: "down",
    icon: Activity,
    color: "text-warning" 
  },
  { 
    title: "Active Analysts", 
    value: "24", 
    change: "+3", 
    trend: "up",
    icon: Users,
    color: "text-accent" 
  },
]

export function DashboardTab() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-foreground md:text-3xl" style={{ fontFamily: 'var(--font-display)' }}>
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Overview of your startup risk analysis portfolio
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/30 hover:bg-card/80">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${
                    stat.trend === "up" ? "text-success" : "text-warning"
                  }`}>
                    {stat.trend === "up" ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    {stat.change}
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts section */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Area chart */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg" style={{ fontFamily: 'var(--font-display)' }}>
                Risk Distribution Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={areaData}>
                    <defs>
                      <linearGradient id="lowGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="oklch(0.70 0.18 145)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="oklch(0.70 0.18 145)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="mediumGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="oklch(0.78 0.18 85)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="oklch(0.78 0.18 85)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="highGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="oklch(0.55 0.22 25)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="oklch(0.55 0.22 25)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.22 0.025 260)" />
                    <XAxis 
                      dataKey="month" 
                      stroke="oklch(0.60 0.02 260)" 
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="oklch(0.60 0.02 260)" 
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'oklch(0.12 0.015 260)',
                        border: '1px solid oklch(0.22 0.025 260)',
                        borderRadius: '8px',
                        color: 'oklch(0.98 0 0)'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="low" 
                      stroke="oklch(0.70 0.18 145)" 
                      fill="url(#lowGradient)"
                      strokeWidth={2}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="medium" 
                      stroke="oklch(0.78 0.18 85)" 
                      fill="url(#mediumGradient)"
                      strokeWidth={2}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="high" 
                      stroke="oklch(0.55 0.22 25)" 
                      fill="url(#highGradient)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pie chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg" style={{ fontFamily: 'var(--font-display)' }}>
                Portfolio Risk Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'oklch(0.12 0.015 260)',
                        border: '1px solid oklch(0.22 0.025 260)',
                        borderRadius: '8px',
                        color: 'oklch(0.98 0 0)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {pieData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="h-3 w-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium text-foreground">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent startups */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg" style={{ fontFamily: 'var(--font-display)' }}>
              Recently Analyzed Startups
            </CardTitle>
            <button className="flex items-center gap-1 text-sm text-primary transition-colors hover:text-primary/80">
              View All
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentStartups.map((startup, index) => (
                <motion.div
                  key={startup.name}
                  className="flex flex-col gap-4 rounded-xl border border-border/50 bg-secondary/30 p-4 transition-all hover:border-primary/30 sm:flex-row sm:items-center sm:justify-between"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{startup.name}</p>
                      <p className="text-sm text-muted-foreground">{startup.sector}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Funding</p>
                      <p className="font-medium text-foreground">{startup.funding}</p>
                    </div>
                    <div className="w-32">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Risk</span>
                        <span className={`text-sm font-medium ${
                          startup.status === "low" ? "text-success" :
                          startup.status === "medium" ? "text-warning" : "text-danger"
                        }`}>
                          {startup.risk}%
                        </span>
                      </div>
                      <Progress 
                        value={startup.risk} 
                        className={`h-2 ${
                          startup.status === "low" ? "[&>div]:bg-success" :
                          startup.status === "medium" ? "[&>div]:bg-warning" : "[&>div]:bg-danger"
                        }`}
                      />
                    </div>
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      startup.status === "low" ? "bg-success/20" :
                      startup.status === "medium" ? "bg-warning/20" : "bg-danger/20"
                    }`}>
                      {startup.status === "low" ? (
                        <CheckCircle2 className="h-4 w-4 text-success" />
                      ) : startup.status === "medium" ? (
                        <AlertTriangle className="h-4 w-4 text-warning" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-danger" />
                      )}
                    </div>
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
