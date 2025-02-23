"use client";

import { Button } from "@/components/ui/button";
import VideoCall from "@/components/VideoCall";
import { useSocket } from "@/context/SocketContext";

export default function Home() {
  const { handleCall, connectedUsersStream } = useSocket();
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <VideoCall />
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="flex items-center justify-center">
          {connectedUsersStream?.map((user) => (
            <Button key={user.userId} variant={"outline"} onClick={()=>handleCall(user.peerId)}>
              {user.userId.substring(0, 10)}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
