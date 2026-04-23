"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Search, 
  Filter, 
  Plus, 
  Building2, 
  TrendingUp,
  TrendingDown,
  ExternalLink,
  MoreVertical,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Users,
  DollarSign,
  Calendar
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"

const startups = [
  {
    id: 1,
    name: "TechFlow AI",
    logo: "T",
    sector: "AI/ML",
    stage: "Series A",
    funding: "$12M",
    risk: 28,
    status: "low",
    trend: "down",
    employees: 45,
    founded: "2022",
    location: "San Francisco, CA",
    description: "AI-powered workflow automation for enterprise teams.",
  },
  {
    id: 2,
    name: "HealthBridge",
    logo: "H",
    sector: "HealthTech",
    stage: "Series B",
    funding: "$8M",
    risk: 45,
    status: "medium",
    trend: "up",
    employees: 120,
    founded: "2020",
    location: "Boston, MA",
    description: "Connecting patients with specialists through telemedicine.",
  },
  {
    id: 3,
    name: "FinanceHub",
    logo: "F",
    sector: "FinTech",
    stage: "Series C",
    funding: "$25M",
    risk: 72,
    status: "high",
    trend: "up",
    employees: 200,
    founded: "2019",
    location: "New York, NY",
    description: "Decentralized finance platform for institutional investors.",
  },
  {
    id: 4,
    name: "EcoSolutions",
    logo: "E",
    sector: "CleanTech",
    stage: "Seed",
    funding: "$5M",
    risk: 35,
    status: "low",
    trend: "down",
    employees: 18,
    founded: "2023",
    location: "Austin, TX",
    description: "Sustainable energy solutions for commercial buildings.",
  },
  {
    id: 5,
    name: "DataVault",
    logo: "D",
    sector: "Enterprise SaaS",
    stage: "Series A",
    funding: "$15M",
    risk: 52,
    status: "medium",
    trend: "down",
    employees: 65,
    founded: "2021",
    location: "Seattle, WA",
    description: "Secure data management and analytics platform.",
  },
  {
    id: 6,
    name: "CyberShield",
    logo: "C",
    sector: "Cybersecurity",
    stage: "Series B",
    funding: "$30M",
    risk: 25,
    status: "low",
    trend: "down",
    employees: 150,
    founded: "2020",
    location: "Washington, DC",
    description: "Next-generation threat detection and response.",
  },
]

const sectors = ["All", "AI/ML", "HealthTech", "FinTech", "CleanTech", "Enterprise SaaS", "Cybersecurity"]

export function StartupsTab() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSector, setSelectedSector] = useState("All")
  const [selectedStartup, setSelectedStartup] = useState<typeof startups[0] | null>(null)

  const filteredStartups = startups.filter((startup) => {
    const matchesSearch = startup.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSector = selectedSector === "All" || startup.sector === selectedSector
    return matchesSearch && matchesSector
  })

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl" style={{ fontFamily: 'var(--font-display)' }}>
            Startups
          </h1>
          <p className="text-muted-foreground">
            Manage and analyze your startup portfolio
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Add Startup
            </Button>
          </DialogTrigger>
          <DialogContent className="border-border/50 bg-card">
            <DialogHeader>
              <DialogTitle style={{ fontFamily: 'var(--font-display)' }}>Add New Startup</DialogTitle>
              <DialogDescription>
                Enter the details of the startup you want to analyze.
              </DialogDescription>
            </DialogHeader>
            <FieldGroup className="mt-4">
              <Field>
                <FieldLabel>Company Name</FieldLabel>
                <Input placeholder="Enter company name" className="bg-secondary/50 border-border/50" />
              </Field>
              <Field>
                <FieldLabel>Sector</FieldLabel>
                <Input placeholder="e.g., AI/ML, FinTech" className="bg-secondary/50 border-border/50" />
              </Field>
              <Field>
                <FieldLabel>Funding Amount</FieldLabel>
                <Input placeholder="e.g., $10M" className="bg-secondary/50 border-border/50" />
              </Field>
              <Field>
                <FieldLabel>Website</FieldLabel>
                <Input placeholder="https://..." className="bg-secondary/50 border-border/50" />
              </Field>
            </FieldGroup>
            <Button className="mt-4 w-full bg-primary text-primary-foreground hover:bg-primary/90">
              Start Analysis
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search startups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-secondary/50 pl-10 border-border/50"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="border-border/50 bg-secondary/50">
              <Filter className="mr-2 h-4 w-4" />
              {selectedSector}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {sectors.map((sector) => (
              <DropdownMenuItem
                key={sector}
                onClick={() => setSelectedSector(sector)}
                className={selectedSector === sector ? "bg-primary/10 text-primary" : ""}
              >
                {sector}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Startup grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filteredStartups.map((startup, index) => (
            <motion.div
              key={startup.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card 
                className="group cursor-pointer border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/50 hover:bg-card/80"
                onClick={() => setSelectedStartup(startup)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-lg font-bold text-primary">
                        {startup.logo}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{startup.name}</h3>
                        <p className="text-sm text-muted-foreground">{startup.sector}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Export Report</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Remove</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <Badge variant="outline" className="border-border/50 bg-secondary/50">
                      {startup.stage}
                    </Badge>
                    <Badge variant="outline" className="border-border/50 bg-secondary/50">
                      {startup.funding}
                    </Badge>
                  </div>

                  <div className="mt-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Risk Score</span>
                      <div className="flex items-center gap-2">
                        {startup.trend === "up" ? (
                          <TrendingUp className="h-3 w-3 text-danger" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-success" />
                        )}
                        <span className={`text-sm font-medium ${
                          startup.status === "low" ? "text-success" :
                          startup.status === "medium" ? "text-warning" : "text-danger"
                        }`}>
                          {startup.risk}%
                        </span>
                      </div>
                    </div>
                    <Progress 
                      value={startup.risk} 
                      className={`h-2 ${
                        startup.status === "low" ? "[&>div]:bg-success" :
                        startup.status === "medium" ? "[&>div]:bg-warning" : "[&>div]:bg-danger"
                      }`}
                    />
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                      startup.status === "low" ? "bg-success/10 text-success" :
                      startup.status === "medium" ? "bg-warning/10 text-warning" : "bg-danger/10 text-danger"
                    }`}>
                      {startup.status === "low" ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : startup.status === "medium" ? (
                        <AlertTriangle className="h-3 w-3" />
                      ) : (
                        <XCircle className="h-3 w-3" />
                      )}
                      {startup.status === "low" ? "Low Risk" : startup.status === "medium" ? "Medium Risk" : "High Risk"}
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Startup detail dialog */}
      <Dialog open={!!selectedStartup} onOpenChange={() => setSelectedStartup(null)}>
        <DialogContent className="max-w-2xl border-border/50 bg-card">
          {selectedStartup && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-2xl font-bold text-primary">
                    {selectedStartup.logo}
                  </div>
                  <div>
                    <DialogTitle className="text-xl" style={{ fontFamily: 'var(--font-display)' }}>
                      {selectedStartup.name}
                    </DialogTitle>
                    <DialogDescription className="mt-1">
                      {selectedStartup.description}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Sector</p>
                      <p className="font-medium text-foreground">{selectedStartup.sector}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Funding</p>
                      <p className="font-medium text-foreground">{selectedStartup.funding}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Employees</p>
                      <p className="font-medium text-foreground">{selectedStartup.employees}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Founded</p>
                      <p className="font-medium text-foreground">{selectedStartup.founded}</p>
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 text-sm text-muted-foreground">Risk Assessment</p>
                    <div className="flex items-center gap-3">
                      <Progress 
                        value={selectedStartup.risk} 
                        className={`h-3 flex-1 ${
                          selectedStartup.status === "low" ? "[&>div]:bg-success" :
                          selectedStartup.status === "medium" ? "[&>div]:bg-warning" : "[&>div]:bg-danger"
                        }`}
                      />
                      <span className={`text-lg font-bold ${
                        selectedStartup.status === "low" ? "text-success" :
                        selectedStartup.status === "medium" ? "text-warning" : "text-danger"
                      }`}>
                        {selectedStartup.risk}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                  View Full Report
                </Button>
                <Button variant="outline" className="border-border/50">
                  Export PDF
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
