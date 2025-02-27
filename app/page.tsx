"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import VideoCall from "@/components/VideoCall";
import { useSocket } from "@/context/SocketContext";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function Home() {
  const { peer, socket, setUserData } = useSocket();
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [interest, setInterest] = useState<string[]>([]);
  const [extraInterest, setExtraInterest] = useState("");
  const [loading, setLoading] = useState(false);

  const interestOptions = [
    { name: "Cricket", value: "cricket" },
    { name: "Volleyball", value: "volleyball" },
    { name: "Football", value: "football" },
    { name: "Table Tennis", value: "tabletennis" },
  ];

  const handleClick = (item: { name: string; value: string }) => {
    setInterest((prev) =>
      prev.includes(item.value)
        ? prev.filter((c) => c !== item.value)
        : [...prev, item.value]
    );
  };

  const handleSubmit = async () => {
    if (!name || (interest.length === 0 && !extraInterest) || !peer || !socket)
      return;
    setLoading(true);

    if (extraInterest) {interest.length === 0
      setInterest((prev) => [...prev, extraInterest]);
      setExtraInterest("");
    }

    try {
      const response = await fetch("/api/embeddings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          interests: interest,
          peerId: peer.id,
          socketId: socket.id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data.user);
        const response2 = await fetch(`/api/match/${data.user._id}`, {
          method: "POST",
        });

        if (response2.ok) {
          setSubmitted(true);
        }
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return <VideoCall />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-6">
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Find Your Match
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Your Name*
            </label>
            <Input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Enter an Interest*
            </label>
            <Input
              type="text"
              placeholder="Type your interest..."
              value={extraInterest}
              onChange={(e) => setExtraInterest(e.target.value)}
            />
          </div>

          <div className="text-center text-gray-500 font-semibold">OR</div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full">
                Select Interests
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {interestOptions.map((item) => (
                <DropdownMenuCheckboxItem
                  key={item.value}
                  checked={interest.includes(item.value)}
                  onClick={() => handleClick(item)}
                >
                  {item.name}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!name || interest.length === 0 || loading}
          className="w-full flex justify-center items-center"
        >
          {loading ? (
            <Loader2 className="animate-spin w-5 h-5 mr-2" />
          ) : (
            "Start Matching"
          )}
        </Button>
      </div>
    </div>
  );
}
