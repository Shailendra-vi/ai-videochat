"use client";

import { useSocket } from "@/context/SocketContext";
import VideoContainer from "./VideoContainer";

const VideoCall = () => {
  const { localStream, connectedUsersStream } = useSocket();

  console.log(connectedUsersStream)
  return (
    <div className="flex items-center justify-center gap-4">
      {localStream && (
        <VideoContainer
          stream={localStream}
          isLocalStream={true}
          isOnCall={false}
        />
      )}
      {connectedUsersStream?.length &&
        connectedUsersStream?.map((connectedUserStream, index) => (
          <VideoContainer
            key={connectedUserStream.userId+index}
            stream={connectedUserStream.stream}
            isLocalStream={true}
            isOnCall={false}
          />
        ))}
    </div>
  );
};

export default VideoCall;
