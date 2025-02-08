'use client'

import { Button } from "@/components/ui/button";
import VideoCall from "@/components/VideoCall";
import { useSocket } from "@/context/SocketContext";


export default function Home() {
  const { handleCall } = useSocket();
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <VideoCall />
      <Button variant={"outline"} onClick={handleCall}>Connect</Button>
    </div>
  );
}
