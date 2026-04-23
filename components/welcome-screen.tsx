"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, Shield, TrendingUp, BarChart3, Sparkles, Zap, Brain, CheckCircle2, Github, Newspaper, LineChart, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useRef, useState } from "react"

interface WelcomeScreenProps {
  onEnter: () => void
}

// Animated particle network background
function ParticleNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    
    const particles: Array<{x: number, y: number, vx: number, vy: number}> = []
    const particleCount = 50
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5
      })
    }
    
    function animate() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Update and draw particles
      particles.forEach((p, i) => {
        p.x += p.vx
        p.y += p.vy
        
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
        
        // Draw particle
        ctx.fillStyle = 'rgba(99, 102, 241, 0.4)'
        ctx.beginPath()
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2)
        ctx.fill()
        
        // Draw connections
        particles.slice(i + 1).forEach(p2 => {
          const dx = p.x - p2.x
          const dy = p.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          
          if (dist < 150) {
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.2 * (1 - dist / 150)})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        })
      })
      
      requestAnimationFrame(animate)
    }
    
    animate()
    
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  return <canvas ref={canvasRef} className="absolute inset-0 opacity-40" />
}

export function WelcomeScreen({ onEnter }: WelcomeScreenProps) {
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])
  
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-b from-[#0a0b14] via-[#0d0e1a] to-[#0a0b14]">
      {/* Animated particle network */}
      <ParticleNetwork />
      
      {/* Gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -left-1/4 top-0 h-[600px] w-[600px] rounded-full blur-[120px]"
          style={{
            background: "radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -right-1/4 top-1/3 h-[500px] w-[500px] rounded-full blur-[100px]"
          style={{
            background: "radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, transparent 70%)",
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -80, 0],
            y: [0, -60, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Subtle grid */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Header */}
        <motion.header 
          className="flex items-center justify-between px-6 py-6 lg:px-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3">
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/50">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <motion.div 
                className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-emerald-400"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-xl font-bold tracking-tight text-transparent">
              RiskRadar
            </span>
          </div>
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm text-gray-400 transition-colors hover:text-white">Features</a>
            <a href="#how-it-works" className="text-sm text-gray-400 transition-colors hover:text-white">How it Works</a>
            <a href="#pricing" className="text-sm text-gray-400 transition-colors hover:text-white">Pricing</a>
          </nav>
          <Button variant="outline" size="sm" className="border-white/10 bg-white/5 text-white backdrop-blur-xl hover:bg-white/10">
            Sign In
          </Button>
        </motion.header>

        {/* Hero Section */}
        <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <motion.div
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 backdrop-blur-xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="h-4 w-4 text-indigo-400" />
            <span className="text-sm text-indigo-300">Powered by XGBoost + SHAP AI</span>
          </motion.div>

          {/* Animated headline */}
          <div className="relative max-w-5xl">
            <motion.div
              className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-3xl"
              animate={{
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.h1 
              className="relative text-5xl font-bold tracking-tight text-white md:text-7xl lg:text-8xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <span className="block">Know Your Risk</span>
              <span className="mt-2 block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Before the Market Does
              </span>
            </motion.h1>
          </div>

          <motion.p 
            className="mt-8 max-w-2xl text-lg text-gray-400 md:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            AI-powered startup risk intelligence. Real-time analysis, explainable insights, 
            and data-driven decisions for investors and founders.
          </motion.p>

          <motion.div 
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <Button 
              size="lg" 
              onClick={onEnter}
              className="group relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 text-lg font-semibold text-white shadow-lg shadow-indigo-500/50 transition-all hover:shadow-xl hover:shadow-indigo-500/60"
            >
              <span className="relative z-10 flex items-center gap-2">
                Start Analyzing
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </span>
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.5 }}
              />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-white/10 bg-white/5 px-8 py-6 text-lg text-white backdrop-blur-xl hover:bg-white/10"
            >
              Watch Demo
            </Button>
          </motion.div>

          {/* Floating dashboard preview */}
          <motion.div
            className="mt-20 w-full max-w-6xl"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
          >
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-pink-500/30 blur-2xl" />
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.02] p-2 shadow-2xl backdrop-blur-xl">
                <div className="aspect-video w-full rounded-xl bg-gradient-to-br from-gray-900 to-gray-950">
                  {/* Fake dashboard preview */}
                  <div className="flex h-full flex-col p-6">
                    <div className="mb-4 flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600" />
                      <div className="h-4 w-32 rounded bg-white/10" />
                    </div>
                    <div className="grid flex-1 grid-cols-3 gap-4">
                      {[...Array(6)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="rounded-xl border border-white/5 bg-white/[0.02] p-4"
                          animate={{
                            opacity: [0.5, 1, 0.5],
                          }}
                          transition={{
                            duration: 2,
                            delay: i * 0.2,
                            repeat: Infinity,
                          }}
                        >
                          <div className="mb-2 h-3 w-20 rounded bg-white/10" />
                          <div className="h-6 w-16 rounded bg-white/20" />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Feature cards */}
          <motion.div 
            className="mt-32 grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-3"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
          >
            {[
              {
                icon: Brain,
                title: "AI Risk Scoring",
                description: "XGBoost + SHAP explainable AI analyzes 50+ risk factors in real-time",
                gradient: "from-indigo-500 to-purple-600",
              },
              {
                icon: Zap,
                title: "Live Enrichment",
                description: "Automatic data gathering from GitHub, news, and financial sources",
                gradient: "from-purple-500 to-pink-600",
              },
              {
                icon: LineChart,
                title: "Smart Benchmarks",
                description: "Compare against 5,000+ startups with sector-specific insights",
                gradient: "from-pink-500 to-rose-600",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.02] p-8 backdrop-blur-xl transition-all hover:border-white/20 hover:shadow-2xl"
                whileHover={{ y: -8, scale: 1.02 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
              >
                <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br from-white/5 to-transparent blur-2xl transition-all group-hover:scale-150" />
                <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} shadow-lg`}>
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </main>

        {/* How it Works Section */}
        <section id="how-it-works" className="relative px-6 py-32">
          <div className="mx-auto max-w-6xl">
            <motion.div
              className="mb-16 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
                How It Works
              </h2>
              <p className="text-lg text-gray-400">
                From search to insights in seconds
              </p>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "Search Any Startup",
                  description: "Enter a company name. If not in our database, we'll enrich it in real-time.",
                  icon: Search,
                },
                {
                  step: "02",
                  title: "AI Analysis",
                  description: "XGBoost model processes 50+ factors. SHAP explains every decision.",
                  icon: Brain,
                },
                {
                  step: "03",
                  title: "Actionable Insights",
                  description: "Get risk scores, benchmarks, and recommendations instantly.",
                  icon: CheckCircle2,
                },
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  className="relative"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                >
                  <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-lg font-bold text-white">
                      {item.step}
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 p-3">
                      <item.icon className="h-full w-full text-indigo-400" />
                    </div>
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-white">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                  {index < 2 && (
                    <div className="absolute -right-4 top-6 hidden h-0.5 w-8 bg-gradient-to-r from-indigo-500 to-transparent md:block" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <motion.footer 
          className="border-t border-white/5 px-6 py-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.5 }}
        >
          <p className="text-sm text-gray-500">
            Powering investment decisions for firms managing over $50B in assets
          </p>
        </motion.footer>
      </div>
    </div>
  )
}
