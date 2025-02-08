import { useUser } from "@clerk/nextjs";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";
import Peer, { SimplePeerData } from "simple-peer";

interface iSocketContext {
  localStream: MediaStream | null;
  connectedUsersStream: iSocketStream[] | null;
  handleCall: () => {};
}

interface iSocketStream {
  socketId: string;
  userId: string;
  stream: MediaStream;
}

interface PeerData {
  peerConnection: Peer.Instance;
  stream: MediaStream | undefined;
}

export const SocketContext = createContext<iSocketContext | null>(null);

export const SocketContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user } = useUser();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [connectedUsersStream, setConnectedUserStream] = useState<
    iSocketStream[] | null
  >(null);
  const [peer, setPeer] = useState<PeerData | null>(null);

  const getMediaStream = useCallback(
    async (faceMode?: string) => {
      if (localStream) {
        return localStream;
      }
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput"
        );

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: {
            width: { min: 640, ideal: 1280, max: 1920 },
            height: { min: 360, ideal: 720, max: 1080 },
            frameRate: { min: 16, ideal: 30, max: 30 },
            facingMode: videoDevices.length > 0 ? faceMode : undefined,
          },
        });
        setLocalStream(stream);
        return stream;
      } catch (error) {
        console.log("Failed to get the stream", error);
        setLocalStream(null);
        return null;
      }
    },
    [localStream]
  );

  const handleClose = () => {};
  const createPeer = useCallback((stream: MediaStream, initiator: boolean) => {
    const iceServers: RTCIceServer[] = [
      {
        urls: [
          "stun:stun.l.google.com:19302",
          "stun:stun1.l.google.com:19302",
          "stun:stun2.l.google.com:19302",
          "stun:stun3.l.google.com:19302",
        ],
      },
    ];

    const peer = new Peer({
      stream,
      initiator,
      trickle: true,
      config: { iceServers },
    });

    peer.on("stream", (stream) => {
      setPeer((prev) => {
        if (prev) {
          return { ...prev, stream };
        }

        return prev;
      });
    });

    peer.on("error", console.error);
    peer.on("close", () => handleClose);

    const rtcPeerConnection: RTCPeerConnection = (peer as any)._pc;
    rtcPeerConnection.oniceconnectionstatechange = async () => {
      if (
        rtcPeerConnection.iceConnectionState === "disconnected" ||
        rtcPeerConnection.iceConnectionState === "failed"
      ) {
        handleClose();
      }
    };

    return peer;
  }, []);

  const handleCall = useCallback(async () => {
    const stream = await getMediaStream();
    if (!stream) return;
    socket?.emit("call", { userId: user?.id, stream: stream });
  }, [socket]);

  // initialise socket
  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);

    return () => {
      newSocket?.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (socket === null) return;
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsSocketConnected(true);
    }
    function onDisconnect() {
      setIsSocketConnected(false);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [socket]);

  useEffect(() => {
    if (!socket || !isSocketConnected) return;

    function handleNewCall(streams: iSocketStream[]) {
      setConnectedUserStream(streams);
    }

    socket.on("newCall", handleNewCall);

    return () => {
      socket.off("newCall", handleNewCall);
    };
  }, [socket, isSocketConnected, user]);

  return (
    <SocketContext.Provider
      value={{
        localStream,
        connectedUsersStream,
        handleCall,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);

  if (context == null) {
    throw new Error("useSocket must be used within a SocketContextProvide");
  }

  return context;
};
