'use client';
import NavBar from "@/components/Navbar";
import { motion } from "motion/react";
import { Video } from "lucide-react"; // Ensure you have this installed

export default function Home() {
  return (
    <>
      <NavBar />
      <main className="relative min-h-screen w-full bg-gradient-to-br from-black via-zinc-900 to-black text-white overflow-hidden">
        {/* Background Blurs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>

        {/* Content */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-32"
        >
          {/* Logo Image */}
          <div>
            <motion.img
              src="/assets/logo.png"
              alt="logo"
              className="h-80 w-100 rounded-3xl shadow-2xl object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Heading */}
          <div className="text-4xl sm:text-5xl font-bold tracking-tight mb-6 mt-6 text-white">
            Hello Stranger
          </div>

          {/* Anonymous Chat Button */}
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: '#e5e5e5', color: '#111' }}
            whileTap={{ scale: 0.95 }}
            className="mt-6 px-6 py-3 bg-white/90 text-gray-900 rounded-md text-lg font-medium transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            <Video size={24} /> Start Anonymous Chat
          </motion.button>
        </motion.div>
      </main>
    </>
  );
}
