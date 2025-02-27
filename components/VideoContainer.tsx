import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";

interface iVideoContainer {
    stream: MediaStream | null;
    isLocalStream: boolean;
    isOnCall: boolean;
}

const VideoContainer = ({ stream, isLocalStream }: iVideoContainer) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    return (
        <div className="relative w-[800px] h-[450px] flex items-center justify-center bg-gray-800 rounded border overflow-hidden">
            {stream ? (
                <video
                    className="w-full h-full object-cover"
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted={isLocalStream}
                ></video>
            ) : (
                <div className="flex flex-col items-center text-white">
                    <Loader2 className="animate-spin w-12 h-12 text-gray-300" />
                    {/* <p className="mt-2 text-gray-300">Waiting for stream...</p> */}
                </div>
            )}
        </div>
    );
};

export default VideoContainer;
