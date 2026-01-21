'use client';

import NavBar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AnimatePresence, motion } from "motion/react";
import { Video } from "lucide-react";
import { io, Socket } from "socket.io-client";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const socketRef = useRef<Socket | null>(null);

  const [status, setStatus] = useState<"idle" | "waiting" | "chatting">("idle");
  const [roomId, setRoomId] = useState("");

  // Initialize socket ONCE
  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected:", socket.id);
    });

    socket.on("matched", ({ roomId }) => {
      console.log("Matched in room:", roomId);
      setRoomId(roomId);
      setStatus("chatting");
    });

    return () => {
      socket.off("matched");
      socket.disconnect();
    };
  }, []);

  const startChat = () => {
    if (!socketRef.current) return;
    socketRef.current.emit("start");
    setStatus("waiting");
  };

  return (
    <>
      <NavBar />

      <main className="relative min-h-screen w-full bg-gradient-to-br from-black via-zinc-900 to-black text-white overflow-hidden">
        {/* Background Blurs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>

        <AnimatePresence mode="wait">
          {status === "idle" && (
            <motion.div
              key="idle"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-32"
            >
              <motion.img
                src="/assets/logo.png"
                alt="logo"
                className="h-80 w-100 rounded-3xl shadow-2xl object-cover"
                whileHover={{ scale: 1.05 }}
              />

              <div className="text-4xl sm:text-5xl font-bold mt-6">
                Hello Stranger
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startChat}
                className="mt-6 px-6 py-3 bg-white text-black rounded-md text-lg font-medium flex items-center gap-2"
              >
                <Video size={24} /> Start Anonymous Chat
              </motion.button>
            </motion.div>
          )}

          {status === "waiting" && (
            <motion.div
              key="waiting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative z-10 flex items-center justify-center min-h-screen text-4xl font-bold"
            >
              Waiting for a stranger...
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </>
  );
}
