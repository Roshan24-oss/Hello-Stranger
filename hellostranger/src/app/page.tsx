"use client";

import NavBar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VideoRoom from "@/components/VideoRoom";
import { AnimatePresence, motion } from "motion/react";
import { Video, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

type Status = "idle" | "waiting" | "chatting" | "left" | "only_one";

export default function Home() {
  const socketRef = useRef<Socket | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [roomId, setRoomId] = useState("");
  const pause = (ms: number) => new Promise((res) => setTimeout(res, ms));

 useEffect(() => {
  const socket: Socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
    transports: ["websocket"],
  });

  socketRef.current = socket;

  socket.on("waiting", () => setStatus("waiting"));
  socket.on("only_one", () => {
    setStatus("only_one");
    setTimeout(() => socket.emit("start"), 1500);
  });
  socket.on("matched", async ({ roomId }) => {
    await pause(1500);
    setRoomId(roomId);
    setStatus("chatting");
  });
  socket.on("partner_left", async () => {
    setRoomId("");
    setStatus("left");
    await pause(1500);
    socket.emit("start");
  });

  
  return () => {
    socket.disconnect(); 
  };
}, []);


  const startChat = () => {
    setStatus("waiting");
    socketRef.current?.emit("start");
  };

  const nextChat = () => {
    setRoomId("");
    setStatus("waiting");
    socketRef.current?.emit("next");
  };

  return (
    <>
      <NavBar />

      <main className="relative min-h-screen bg-black text-white flex flex-col items-center">
        <AnimatePresence mode="wait">
        
          {status === "idle" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center min-h-screen px-4 text-center gap-6"
            >
              <motion.img
                src="/assets/logo.png"
                alt="logo"
                className="rounded-2xl shadow-2xl object-cover
                  w-50 h-40
                  sm:w-65 sm:h-56
                  md:w-85 md:h-72
                  lg:w-92 lg:h-80
                "
                whileHover={{ scale: 1.05 }}
              />
              <h1 className="font-bold
                text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white
              ">
                Hello Stranger
              </h1>
              <button
                onClick={startChat}
                className="px-4 py-2 sm:px-6 sm:py-3 bg-white text-black rounded-md flex gap-2 items-center"
              >
                <Video /> Start Chat
              </button>
            </motion.div>
          )}

          
          {(status === "waiting" || status === "left" || status === "only_one") && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center min-h-screen gap-4 px-4 text-center"
            >
              <Loader2 className="h-10 w-10 animate-spin" />
              <div className="text-xl sm:text-2xl font-semibold">
                {status === "left" && "Stranger has left…"}
                {status === "waiting" && "Waiting for a stranger…"}
                {status === "only_one" && "Only one stranger available…"}
              </div>
            </motion.div>
          )}

          
          {status === "chatting" && roomId && (
            <>
              <VideoRoom roomId={roomId} />

              {/* NEXT BUTTON */}
              <button
                onClick={nextChat}
                className="
                  fixed top-20 right-4 z-[9999]
                  px-3 py-2 sm:px-4 sm:py-2 md:px-5 md:py-3
                  bg-red-600 text-white rounded-full shadow-lg
                  hover:bg-red-700
                "
              >
                Next
              </button>
            </>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </>
  );
}
