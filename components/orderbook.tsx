"use client";
import React, { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useWebSocket } from "@/providers/web-socket";

export const Orderbook: React.FC = () => {
  const { messages, isConnected } = useWebSocket();

  const currentData = useMemo(() => {
    if (!messages.length) {
      return { yes: {}, no: {} };
    }
    return messages[messages.length - 1];
  }, [messages]);

  const sortedYesLevels = useMemo(() => {
    return Object.entries(currentData.yes)
      .map(([price, level]) => ({
        price: parseFloat(price),
        ...level,
      }))
      .sort((a, b) => b.price - a.price)
      .filter((level) => level.total > 0);
  }, [currentData.yes]);

  const sortedNoLevels = useMemo(() => {
    return Object.entries(currentData.no)
      .map(([price, level]) => ({
        price: parseFloat(price),
        ...level,
      }))
      .sort((a, b) => b.price - a.price)
      .filter((level) => level.total > 0);
  }, [currentData.no]);

  const maxTotal = useMemo(() => {
    const yesMax = Math.max(
      ...Object.values(currentData.yes).map((level) => level.total),
      0
    );
    const noMax = Math.max(
      ...Object.values(currentData.no).map((level) => level.total),
      0
    );
    return Math.max(yesMax, noMax, 1);
  }, [currentData]);

  const PriceLevel: React.FC<{
    price: number;
    total: number;
    maxTotal: number;
    side: "yes" | "no";
  }> = ({ price, total, maxTotal, side }) => {
    const percentage = (total / maxTotal) * 100;
    const bgColor = side === "yes" ? "bg-blue-300" : "bg-red-300";

    return (
      <div className="grid grid-cols-2 relative h-8 px-2">
        <div className="z-10 flex items-center">{price.toFixed(1)}</div>
        <div className="text-right z-10 flex items-center justify-end">
          {total}
        </div>
        <div
          className={`absolute inset-0 opacity-50 transition-all duration-200 ${bgColor}`}
          style={{
            width: `${percentage}%`,
            ...(side === "no" && { right: 0 }),
          }}
        />
      </div>
    );
  };

  return (
    <Card className="w-full max-w-4xl p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Order Book</h2>
        <Badge variant={isConnected ? "success" : "destructive"}>
          {isConnected ? "Connected" : "Disconnected"}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* YES side */}
        <div>
          <div className="grid grid-cols-2 mb-2 font-semibold text-sm border-b pb-2">
            <div>PRICE</div>
            <div className="text-right">QTY AT YES</div>
          </div>
          <div className="space-y-1">
            {sortedYesLevels.map(({ price, total }) => (
              <PriceLevel
                key={price}
                price={price}
                total={total}
                maxTotal={maxTotal}
                side="yes"
              />
            ))}
            {sortedYesLevels.length === 0 && (
              <div className="text-center py-4 text-gray-500">No orders</div>
            )}
          </div>
        </div>

        {/* NO side */}
        <div>
          <div className="grid grid-cols-2 mb-2 font-semibold text-sm border-b pb-2">
            <div>PRICE</div>
            <div className="text-right">QTY AT NO</div>
          </div>
          <div className="space-y-1">
            {sortedNoLevels.map(({ price, total }) => (
              <PriceLevel
                key={price}
                price={price}
                total={total}
                maxTotal={maxTotal}
                side="no"
              />
            ))}
            {sortedNoLevels.length === 0 && (
              <div className="text-center py-4 text-gray-500">No orders</div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
