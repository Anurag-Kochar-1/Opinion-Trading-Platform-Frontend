"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowDown,
  ArrowUp,
  ExternalLink,
  Loader2,
  Lock,
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { StockBalance } from "@/types";
import { useUser, useUserStockBalance } from "@/services/user/queries";
import { Skeleton } from "@/components/ui/skeleton";
import { useStore } from "@/store";
import Link from "next/link";

const Page = () => {
  const { data: user, isLoading: isUserLoading } = useUser();
  const setIsSignUpModalOpen = useStore((state) => state.setIsSignUpModalOpen);
  const hasUserIdHydrated = useStore((state) => state.hasUserIdHydrated);

  const {
    data: stockBalance,
    isLoading: isStockBalanceLoading,
    isError: isStockBalanceError,
    error: stockBalanceError,
  } = useUserStockBalance();

  const calculateTotals = (balance: StockBalance) => {
    return {
      totalQuantity: balance.yes.quantity + balance.no.quantity,
      totalLocked: balance.yes.locked + balance.no.locked,
    };
  };

  if (isUserLoading || !hasUserIdHydrated) {
    return (
      <div className="w-full h-[calc(100vh-5rem)] flex justify-center items-center">
        <Loader2 size={40} className="animate-spin" />
      </div>
    );
  }

  if (user?.statusCode !== 200 && !isUserLoading) {
    return (
      <div className="w-full h-[calc(100vh-5rem)] flex justify-center items-center gap-2">
        {" "}
        <p>Please Sign up to check your stock balance</p>{" "}
        <Button onClick={() => setIsSignUpModalOpen(true)}> Sign up </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Stock Balances</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isStockBalanceLoading ? (
          Array.from({ length: 9 }).map((_, index) => (
            <Skeleton key={index} className="min-h-60" />
          ))
        ) : isStockBalanceError ? (
          stockBalanceError?.message
        ) : Object.keys(stockBalance?.data || {}).length === 0 ? (
          <span> No Stocks Available</span>
        ) : (
          Object.entries(stockBalance?.data || {}).map(
            ([stockName, balance]) => {
              const { totalQuantity, totalLocked } = calculateTotals(balance);

              return (
                <Card key={stockName} className="shadow-lg">
                  <CardHeader className="flex flex-row items-center justify-start gap-4">
                    <CardTitle className="text-xl mt-2">{stockName}</CardTitle>
                    <Link href={`/events/${stockName}`}>
                      <ExternalLink size={15} />
                    </Link>

                    {false && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size={"icon"}>
                            <MoreVertical size={15} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Sell</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Total Summary */}
                      <div className="pb-4 border-b">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-500">
                            Total Quantity
                          </span>
                          <span className="font-semibold">{totalQuantity}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">
                            Total Locked
                          </span>
                          <div className="flex items-center gap-1">
                            <span className="font-semibold">{totalLocked}</span>
                          </div>
                        </div>
                      </div>

                      {/* Yes Position */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ArrowUp className="text-green-500" />
                          <span className="font-medium">Yes Position</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span>{balance.yes.quantity}</span>
                          {balance.yes.locked > 0 && (
                            <div className="flex items-center gap-1 text-gray-500">
                              <Lock className="w-4 h-4" />
                              <span>{balance.yes.locked}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* No Position */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ArrowDown className="text-red-500" />
                          <span className="font-medium">No Position</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span>{balance.no.quantity}</span>
                          {balance.no.locked > 0 && (
                            <div className="flex items-center gap-1 text-gray-500">
                              <Lock className="w-4 h-4" />
                              <span>{balance.no.locked}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            }
          )
        )}
      </div>
    </div>
  );
};

export default Page;
