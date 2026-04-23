"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { WelcomeScreen } from "@/components/welcome-screen"
import { Dashboard } from "@/components/dashboard"

export default function Home() {
  const [showDashboard, setShowDashboard] = useState(false)

  return (
    <AnimatePresence mode="wait">
      {!showDashboard ? (
        <motion.div
          key="welcome"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5 }}
        >
          <WelcomeScreen onEnter={() => setShowDashboard(true)} />
        </motion.div>
      ) : (
        <motion.div
          key="dashboard"
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Dashboard onLogout={() => setShowDashboard(false)} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
