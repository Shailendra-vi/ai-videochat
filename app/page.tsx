"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import VideoCall from "@/components/VideoCall";
import { useSocket } from "@/context/SocketContext";
import { useEffect, useState } from "react";

export default function Home() {
  const { interest, setInterest, peer, socket } = useSocket();
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const interestOptions = [
    {
      name: "Cricket",
      value: "cricket",
    },
    {
      name: "Bolleyball",
      value: "bollyball",
    },
    {
      name: "Football",
      value: "football",
    },
    {
      name: "Table Tennis",
      value: "tabletennis",
    },
  ];

  const handleClick = (item: { name: string; value: string }) => {
    if (!interest.some((s) => s === item.value)) {
      setInterest((prev) => [...prev, item.value]);
    } else {
      setInterest(interest.filter((c) => c !== item.value));
    }
  };

  const handleSubmit = async () => {
    if (!name || interest.length === 0 || !peer || !socket) return;

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
      console.log("Embeddings API data", data);

      const response2 = await fetch(`/api/match/${data.user._id}`, {
        method: "POST",
      });

      if (response2.ok) {
        const data2 = await response2.json();
        console.log("Match API data", data2);
        setSubmitted(true);
      }
    }
  };

  if (submitted) {
    return <VideoCall />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md space-y-4">
        <input
          type="text"
          placeholder="Your Name"
          className="w-full p-2 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Select Interests</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {interestOptions.map((item) => (
              <DropdownMenuCheckboxItem
                key={item.name}
                checked={interest.some((s) => s === item.value)}
                onClick={() => handleClick(item)}
              >
                {item.name}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          onClick={handleSubmit}
          disabled={!name || interest.length === 0}
          className="w-full"
        >
          Start Matching
        </Button>
      </div>
    </div>
  );
}
