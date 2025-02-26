"use client";

import { useSocket } from "@/context/SocketContext";
import VideoContainer from "./VideoContainer";

const VideoCall = () => {
  const { localStream, remoteStream } = useSocket();

  // console.log("Streams: ", localStream, remoteStream);
  if(!localStream || !remoteStream) return null;
  
  return (
    <div className="flex items-center justify-center gap-4">
      {localStream && (
        <VideoContainer
          stream={localStream}
          isLocalStream={true}
          isOnCall={false}
        />
      )}
      {remoteStream && (
        <VideoContainer
          stream={remoteStream}
          isLocalStream={false}
          isOnCall={false}
        />
      )}
    </div>
  );
};

export default VideoCall;
