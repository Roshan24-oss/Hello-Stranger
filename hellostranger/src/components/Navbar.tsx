'use client'

import React from 'react'
import { motion } from "motion/react"
import { Sparkle } from 'lucide-react'

const Navbar = () => {
  return (
    <motion.div
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 left-0 right-0 z-30 bg-black/50 backdrop-blur border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/assets/icon.png" className="rounded-full h-10 w-10" alt="logo" />
          <div className="text-3xl font-bold text-white flex items-center gap-2">
            Hello Stranger
            <Sparkle className="w-6 h-6 text-yellow-400 animate-pulse" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Navbar
