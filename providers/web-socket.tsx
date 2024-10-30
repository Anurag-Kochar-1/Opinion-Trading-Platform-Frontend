"use client";
import { useUser } from "@/services/user/queries";
import React, { createContext, useContext, useEffect, useState } from "react";

export interface WebSocketMessage {
  type: string;
  data: unknown;
}

export interface StockSubscription {
  type: string;
  stockSymbol: string;
}

interface WebSocketContextType {
  messages: WebSocketMessage[];
  sendMessage: (message: string) => void;
  isConnected: boolean;
}

const WebSocketContext = createContext<WebSocketContextType>({
  messages: [],
  sendMessage: () => {},
  isConnected: false,
});

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const { data: user, isLoading: isUserLoading } = useUser();

  const createWebSocketConnection = () => {
    const ws = new WebSocket("ws://localhost:5000");

    ws.addEventListener("open", () => {
      console.log("Connected to WebSocket");
      setIsConnected(true);

      const subscriptionMessage: StockSubscription = {
        type: "subscribe",
        stockSymbol: "TESLA",
      };
      ws.send(JSON.stringify(subscriptionMessage));
    });

    ws.addEventListener("message", (event) => {
      const message = JSON.parse(
        JSON.parse(JSON.parse(event.data).message).message
      );
      setMessages((prev) => [...prev, message]);
    });

    ws.addEventListener("error", (error) => {
      console.error("WebSocket error:", error);
      setIsConnected(false);
    });

    ws.addEventListener("close", () => {
      console.log("Disconnected from WebSocket");
      setIsConnected(false);
    });

    return ws;
  };

  const cleanupWebSocket = () => {
    if (socket) {
      console.log("Cleaning up WebSocket connection");
      if (socket.readyState === WebSocket.OPEN) {
        const unsubscribeMessage = {
          type: "unsubscribe",
          stockSymbol: "TESLA",
        };
        socket.send(JSON.stringify(unsubscribeMessage));
        socket.close();
      }
      setSocket(null);
      setIsConnected(false);
      setMessages([]);
    }
  };

  useEffect(() => {
    if (isUserLoading) {
      return;
    }

    if (user?.statusCode === 200) {
      const ws = createWebSocketConnection();
      setSocket(ws);

      return () => {
        cleanupWebSocket();
      };
    } else {
      cleanupWebSocket();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.statusCode, isUserLoading]);

  const sendMessage = (message: string) => {
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: "message", data: message }));
    }
  };

  return (
    <WebSocketContext.Provider value={{ messages, sendMessage, isConnected }}>
      {children}
    </WebSocketContext.Provider>
  );
}

export const useWebSocket = () => useContext(WebSocketContext);
