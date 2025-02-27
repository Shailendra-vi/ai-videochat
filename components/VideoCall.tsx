"use client";

import { useSocket } from "@/context/SocketContext";
import VideoContainer from "./VideoContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const VideoCall = () => {
  const {
    userData,
    localStream,
    remoteStream,
    setLocalStream,
    setRemoteStream,
    call
  } = useSocket();

  const handleNext = async () => {
    setRemoteStream(null);
    try {
      call?.close();
      const response = await fetch(`/api/match/${userData._id}`, {
        method: "POST",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <Card className="w-full max-w-3xl p-4 shadow-lg bg-white">
        <CardContent className="flex flex-col items-center gap-6">
          <div className="grid grid-cols-2 gap-4">
            <VideoContainer
              stream={localStream}
              isLocalStream={true}
              isOnCall={!!remoteStream}
            />
            <VideoContainer
              stream={remoteStream}
              isLocalStream={false}
              isOnCall={!!remoteStream}
            />
          </div>
          <Button variant="outline" size="lg" onClick={handleNext} className="w-32">
            {remoteStream ? "Next" : <Loader2 className="animate-spin" />}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default VideoCall;