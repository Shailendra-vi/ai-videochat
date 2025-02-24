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
import { useEffect } from "react";

export default function Home() {
  const { handleCall, connectedUsersStream, interest, setInterest } =
    useSocket();

  const interestOption = [
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
  useEffect(() => {
    async function generateEmbedd() {
      const response = await fetch("/api/embeddings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interest: ["cricket", "football"] }),
      });

      const data = await response.json();
      console.log(data);
    }
    generateEmbedd();
  }, []);

  const handleClick = (item: { name: string; value: string }) => {
    if (!interest.some((s) => s === item.value)) {
      setInterest((prev) => [...prev, item.value]);
    } else {
      setInterest(interest.filter((c) => c !== item.value));
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="flex flex-col items-center justify-center gap-2">
        <VideoCall />

        <div className="flex items-center justify-center">
          {connectedUsersStream?.map((user) => (
            <Button
              key={user.userId}
              variant={"outline"}
              onClick={() => handleCall(user.peerId)}
            >
              {user.userId.substring(0, 10)}
            </Button>
          ))}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Open</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            {interestOption.map((item) => (
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
      </div>
    </div>
  );
}
