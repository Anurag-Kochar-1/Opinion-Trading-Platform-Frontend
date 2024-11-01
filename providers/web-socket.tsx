"use client";
import { useOrderbookByStockSymbol, useUser } from "@/services/user/queries";
import { OrderBookEntry, WebSocketStatus } from "@/types";
import { useParams } from "next/navigation";
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
  messages: Array<OrderBookEntry>;
  sendMessage: (message: string) => void;
  isConnected: boolean;
  status: WebSocketStatus;
}

const WebSocketContext = createContext<WebSocketContextType>({
  messages: [],
  sendMessage: () => {},
  isConnected: false,
  status: "Disconnected",
});

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const stockId = params?.id as string;

  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<Array<OrderBookEntry>>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [status, setStatus] = useState<WebSocketStatus>("Disconnected");

  const [currentSubscriptionStockId, setCurrentSubscriptionStockId] = useState<
    string | null
  >(null);

  const { data: user, isLoading: isUserLoading } = useUser();
  const { data: orderBookData, isLoading: isOrderBookDataLoading } =
    useOrderbookByStockSymbol({
      stockSymbol: stockId,
    });

  const subscribeToStock = (stockSymbol: string) => {
    if (socket?.readyState === WebSocket.OPEN) {
      if (currentSubscriptionStockId) {
        const unsubscribeMessage: StockSubscription = {
          type: "unsubscribe",
          stockSymbol: currentSubscriptionStockId,
        };
        socket.send(JSON.stringify(unsubscribeMessage));
      }

      const subscriptionMessage: StockSubscription = {
        type: "subscribe",
        stockSymbol: stockSymbol,
      };
      socket.send(JSON.stringify(subscriptionMessage));
      setCurrentSubscriptionStockId(stockSymbol);
    }
  };

  const createWebSocketConnection = () => {
    if (!process.env.NEXT_PUBLIC_WS_URL) {
      throw new Error("Websocket url is not defined!");
    }

    const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL);
    setStatus("Connecting...");

    ws.addEventListener("open", () => {
      console.log("Connected to WebSocket");
      setIsConnected(true);
      setStatus("Connected");

      if (stockId) {
        subscribeToStock(stockId);
      }
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
      setStatus("Error Occurred");
    });

    ws.addEventListener("close", () => {
      console.log("Disconnected from WebSocket");
      setIsConnected(false);
      setStatus("Disconnected");
    });

    return ws;
  };

  const cleanupWebSocket = () => {
    if (socket) {
      console.log("Cleaning up WebSocket connection");
      if (socket.readyState === WebSocket.OPEN && currentSubscriptionStockId) {
        const unsubscribeMessage = {
          type: "unsubscribe",
          stockSymbol: currentSubscriptionStockId,
        };
        socket.send(JSON.stringify(unsubscribeMessage));
        socket.close();
      }
      setSocket(null);
      setIsConnected(false);
      setStatus("Disconnected");
      setMessages([]);
      setCurrentSubscriptionStockId(null);
    }
  };

  const sendMessage = (message: string) => {
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: "message", data: message }));
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

  useEffect(() => {
    if (orderBookData?.statusType === "SUCCESS") {
      if (isUserLoading || isOrderBookDataLoading) return;

      if (user?.statusCode === 200 || orderBookData.statusCode === 200) {
        setMessages((prev) => [...prev, orderBookData.data!]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.statusCode, isOrderBookDataLoading, isUserLoading, stockId]);

  useEffect(() => {
    if (isConnected && stockId && stockId !== currentSubscriptionStockId) {
      subscribeToStock(stockId);
    }
  }, [stockId, isConnected]);

  return (
    <WebSocketContext.Provider
      value={{ messages, sendMessage, isConnected, status }}
    >
      {children}
    </WebSocketContext.Provider>
  );
}

export const useWebSocket = () => useContext(WebSocketContext);
