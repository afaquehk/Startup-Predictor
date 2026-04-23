"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  Building2,
  Loader2,
  AlertCircle,
  TrendingUp,
  ExternalLink,
  Sparkles
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { api, type StartupSuggestion, type StartupData } from "@/lib/api"

interface StartupSearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onStartupSelected: (startup: StartupData) => void
}

export function StartupSearchDialog({
  open,
  onOpenChange,
  onStartupSelected
}: StartupSearchDialogProps) {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<StartupSuggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [enriching, setEnriching] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Debounced search for suggestions
  useEffect(() => {
    if (!query || query.length < 2) {
      setSuggestions([])
      return
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await api.suggestStartups(query, 8)
        setSuggestions(result.suggestions)
      } catch (err) {
        console.error("Suggestion error:", err)
        setSuggestions([])
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  const handleSelectStartup = async (name: string) => {
    try {
      setLoading(true)
      setError(null)

      // First, try to lookup in dataset
      const lookupResult = await api.lookupStartup(name, true)

      if (lookupResult.found && lookupResult.data) {
        onStartupSelected(lookupResult.data)
        onOpenChange(false)
        setQuery("")
        setSuggestions([])
      } else {
        // Not in dataset, trigger enrichment
        setEnriching(true)
        const enrichResult = await api.enrichStartup(name)
        
        if (enrichResult.success && enrichResult.data) {
          onStartupSelected(enrichResult.data)
          onOpenChange(false)
          setQuery("")
          setSuggestions([])
        } else {
          setError("Failed to enrich startup data")
        }
      }
    } catch (err) {
      console.error("Selection error:", err)
      setError(err instanceof Error ? err.message : "Failed to load startup data")
    } finally {
      setLoading(false)
      setEnriching(false)
    }
  }

  const handleManualSearch = async () => {
    if (!query.trim()) return
    await handleSelectStartup(query.trim())
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl border-border/50 bg-card">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl" style={{ fontFamily: 'var(--font-display)' }}>
            <Search className="h-5 w-5 text-primary" />
            Search Startup
          </DialogTitle>
          <DialogDescription>
            Search our database of 5,000+ startups or enter any company name for AI-powered enrichment
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Enter startup name (e.g., Stripe, Airbnb, OpenAI)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && query.trim()) {
                  handleManualSearch()
                }
              }}
              className="h-12 bg-secondary/50 pl-11 pr-4 text-base border-border/50"
              disabled={loading || enriching}
            />
            {loading && (
              <Loader2 className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-primary" />
            )}
          </div>

          {/* Enrichment Status */}
          <AnimatePresence>
            {enriching && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4"
              >
                <Sparkles className="h-5 w-5 animate-pulse text-primary" />
                <div className="flex-1">
                  <p className="font-medium text-foreground">AI Enrichment in Progress</p>
                  <p className="text-sm text-muted-foreground">
                    Gathering data from web sources, GitHub, news, and more...
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-3 rounded-xl border border-danger/30 bg-danger/5 p-4"
              >
                <AlertCircle className="h-5 w-5 text-danger" />
                <div className="flex-1">
                  <p className="font-medium text-danger">Error</p>
                  <p className="text-sm text-danger/80">{error}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setError(null)}
                  className="text-danger hover:text-danger/80"
                >
                  Dismiss
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Suggestions List */}
          {suggestions.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Suggestions from database
              </p>
              <div className="max-h-[400px] space-y-2 overflow-y-auto">
                <AnimatePresence mode="popLayout">
                  {suggestions.map((suggestion, index) => (
                    <motion.button
                      key={suggestion.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      onClick={() => handleSelectStartup(suggestion.name)}
                      disabled={loading || enriching}
                      className="group flex w-full items-center gap-4 rounded-xl border border-border/50 bg-secondary/30 p-4 text-left transition-all hover:border-primary/50 hover:bg-secondary/50 disabled:opacity-50"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                        <Building2 className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-foreground group-hover:text-primary">
                          {suggestion.name}
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          <Badge variant="outline" className="border-border/50 bg-background/50 text-xs">
                            {suggestion.sector}
                          </Badge>
                          <Badge variant="outline" className="border-border/50 bg-background/50 text-xs">
                            {suggestion.stage}
                          </Badge>
                        </div>
                      </div>
                      <TrendingUp className="h-5 w-5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                    </motion.button>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* No Results / Manual Entry */}
          {query.length >= 2 && suggestions.length === 0 && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-xl border border-border/50 bg-secondary/20 p-6 text-center"
            >
              <Sparkles className="mx-auto h-12 w-12 text-primary/50" />
              <p className="mt-3 font-medium text-foreground">
                Not in our database?
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                We'll use AI to gather data from the web, GitHub, news sources, and more
              </p>
              <Button
                onClick={handleManualSearch}
                disabled={loading || enriching}
                className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Enrich "{query}"
              </Button>
            </motion.div>
          )}

          {/* Empty State */}
          {!query && (
            <div className="rounded-xl border border-border/50 bg-secondary/20 p-8 text-center">
              <Search className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-3 text-sm text-muted-foreground">
                Start typing to search for startups
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
