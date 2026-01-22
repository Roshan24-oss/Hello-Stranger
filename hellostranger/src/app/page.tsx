'use client';

import NavBar from "@/components/Navbar";
import VideoRoom from "@/components/VideoRoom";
import Footer from "@/components/Footer";
import { AnimatePresence, motion } from "motion/react";
import { Video } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

export default function Home() {
  const socketRef = useRef<Socket | null>(null);
  const [status, setStatus] = useState<"idle" | "waiting" | "chatting">("idle");
  const [roomId, setRoomId] = useState("");

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      transports: ["websocket"],
    });
    socketRef.current = socket;

    socket.on("connect", () => console.log("Connected:", socket.id));

    socket.on("matched", ({ roomId }) => {
      console.log("Matched in room:", roomId);
      setRoomId(roomId);
      setStatus("chatting");
    });

    socket.on("waiting", () => setStatus("waiting"));
    socket.on("partner_left", () => window.location.reload());

    return () => {
      socket.off();
    };
  }, []);

  const startChat = () => {
    if (!socketRef.current) return;
    socketRef.current.emit("start");
    setStatus("waiting");
  };

  const nextChat = () => {
    if (!socketRef.current) return;
    socketRef.current.emit("next");
    window.location.reload();
  };

  return (
    <>
      <NavBar />
      <main className="relative min-h-screen w-full bg-gradient-to-br from-black via-zinc-900 to-black text-white overflow-hidden">
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
              <div className="text-4xl sm:text-5xl font-bold mt-6">Hello Stranger</div>
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

          {status === "chatting" && roomId && (
            <motion.div
              key="chatting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative z-10 flex flex-col items-center justify-center min-h-screen"
            >
              <VideoRoom roomId={roomId} />
              <button
                onClick={nextChat}
                className="mt-6 px-6 py-3 bg-red-600 text-white rounded-md"
              >
                Next
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </>
  );
}
