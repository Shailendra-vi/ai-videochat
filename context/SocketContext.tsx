import { useUser } from "@clerk/nextjs";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";
import { Peer } from "peerjs";
import { DefaultEventsMap } from "@socket.io/component-emitter";

interface iSocketContext {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  connectedUsersStream: iSocketStream[] | null;
  handleCall: (userId: string) => Promise<void>;
  interest: String[] | [];
  setInterest: Dispatch<SetStateAction<[] | String[]>>;
}

interface iSocketStream {
  socketId: string;
  userId: string;
  peerId: string;
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
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [connectedUsersStream, setConnectedUserStream] = useState<
    iSocketStream[] | null
  >(null);
  const [interest, setInterest] = useState<String[] | []>([]);
  const [peer, setPeer] = useState<Peer | null>(null);

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

  const handleCall = useCallback(
    async (peerId: string) => {
      const stream = await getMediaStream();
      if (!stream) return;
      if (user) {
        peer?.call(peerId, stream);
      }
    },
    [socket, peer]
  );

  // initialise socket
  useEffect(() => {
    let socket: Socket<DefaultEventsMap, DefaultEventsMap> | null = null;
    let newPeer: Peer;
    if (user) {
      newPeer = new Peer(user.id);

      newPeer.on("call", async (call) => {
        const stream = await getMediaStream();
        if (stream) {
          call.answer(stream);
          call.on("stream", (remoteStream) => {
            setRemoteStream(remoteStream);
          });
        }
      });

      socket = io();
      setSocket(socket);
      setPeer(newPeer);

      if (socket === null) return;
      if (socket.connected) {
        onConnect();
      }

      socket.on("connect", onConnect);
      socket.on("disconnect", onDisconnect);
      socket.on("userList", handleUserList);
    }

    function onConnect() {
      setIsSocketConnected(true);
      socket?.emit("join", {
        userId: user?.id,
        peerId: newPeer?.id,
        interest: interest,
      });
    }

    function onDisconnect() {
      setIsSocketConnected(false);
    }

    function handleUserList(data: any) {
      const connectedUserList = data.filter((u: any) => u.userId !== user?.id);
      setConnectedUserStream(connectedUserList);
    }

    return () => {
      socket?.off("connect", onConnect);
      socket?.off("disconnect", onDisconnect);
      socket?.off("userList", handleUserList);
      socket?.disconnect();
      newPeer?.destroy();
    };
  }, [user]);

  useEffect(() => {
    if (socket) {
      socket?.emit("join", {
        userId: user?.id,
        peerId: peer?.id,
        interest: interest,
      });
    }
  }, [interest]);

  // console.log(connectedUsersStream)

  return (
    <SocketContext.Provider
      value={{
        localStream,
        remoteStream,
        connectedUsersStream,
        handleCall,
        interest,
        setInterest,
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
