"use client";
import React from "react";
import { Card } from "../ui/card";
import { useWebSocket } from "@/providers/web-socket";

export const Orderbook = () => {
  const { messages, isConnected } = useWebSocket();
  return (
    <Card className="w-full h-auto min-h-96">
      <div className="p-4">
        <div className="mb-2">
          Connection Status:
          <span className={isConnected ? "text-green-500" : "text-red-500"}>
            {isConnected ? " Connected" : " Disconnected"}
          </span>
        </div>

        <div className="mb-4 h-full overflow-y-auto border rounded p-4">
          {messages.map((msg, index) => (
            <div key={index} className="mb-4 bg-slate-300 p-4">
              {JSON.stringify(msg)}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
