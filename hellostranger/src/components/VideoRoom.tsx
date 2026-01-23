"use client";

import { useEffect, useRef } from "react";

interface VideoRoomProps {
  roomId: string;
}

export default function VideoRoom({ roomId }: VideoRoomProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const zpRef = useRef<any>(null);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const { ZegoUIKitPrebuilt } = await import(
        "@zegocloud/zego-uikit-prebuilt"
      );

      if (!mounted || !containerRef.current) return;

      const userId = crypto.randomUUID();

      const kitToken =
        ZegoUIKitPrebuilt.generateKitTokenForTest(
          Number(process.env.NEXT_PUBLIC_ZEGO_APP_ID),
          process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET!,
          roomId,
          userId,
          `user-${userId.slice(0, 5)}`
        );

      const zp = ZegoUIKitPrebuilt.create(kitToken);
      zpRef.current = zp;

      zp.joinRoom({
        container: containerRef.current,
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall,
        },
        showPreJoinView: false,
        showTextChat: true,
        maxUsers: 2,
      });
    };

    init();

    return () => {
      mounted = false;
      try {
        zpRef.current?.destroy();
      } catch (err) {
        console.warn("Zego destroy error:", err);
      } finally {
        zpRef.current = null;
      }
    };
  }, [roomId]);

  return <div ref={containerRef} className="w-full h-screen" />;
}
