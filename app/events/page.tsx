"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Banknote, PackageSearch, RefreshCcw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAllStockSymbolsQuery } from "@/services/symbol/queries";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { memo } from "react";
import { Hero } from "@/components/hero";
import { Separator } from "@/components/ui/separator";

const ACTIVE_THRESHOLD = 5;

export default function StockSymbolsPage() {
  const {
    data: stockSymbols,
    isLoading: isStockSymbolsLoading,
    error: stockSymbolsError,
    refetch: refetchStockSymbols,
    isRefetching: isStockSymbolsRefetching,
  } = useAllStockSymbolsQuery();

  const hasData = stockSymbols?.data && stockSymbols.data.length > 0;

  return (
    <div>
      <Hero />
      <Separator orientation="horizontal" className="container mx-auto" />

      {/* Content Section */}
      <div className="container mx-auto px-4 pb-20 pt-8" id="markets">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold">Available Markets</h2>
          <Badge variant="outline" className="text-sm hidden sm:block">
            {stockSymbols?.data!.length || 0} Markets Available
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isStockSymbolsLoading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <Card key={index} className="relative">
                <CardContent className="p-6">
                  <div className="space-y-4 animate-pulse">
                    <div className="h-6 bg-muted rounded-md w-2/3" />
                    <div className="flex items-center gap-2">
                      <div className="h-4 bg-muted rounded-md w-1/3" />
                    </div>
                    <div className="h-5 bg-muted rounded-full w-1/4" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : stockSymbolsError ? (
            <Alert
              variant="destructive"
              className="col-span-full lg:col-span-2"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Failed to load stock symbols. Please try again later.
              </AlertDescription>
            </Alert>
          ) : !hasData ? (
            <div className="col-span-full">
              <EmptyState
                refetch={refetchStockSymbols}
                isRefetching={isStockSymbolsRefetching}
              />
            </div>
          ) : (
            stockSymbols?.data!.map((stock, index) => {
              const title = stock.symbol.split("_").join(" ");
              return (
                <Link
                  href={`/events/${stock.symbol}`}
                  key={stock.symbol}
                  className="block group"
                >
                  <Card className="relative h-full transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1 border-2 group-hover:border-primary/20">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 flex-col justify-start mb-4">
                        {index < 3 && stock.totalOrders >= ACTIVE_THRESHOLD && (
                          <Badge
                            variant="default"
                            className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20"
                          >
                            Most Active
                          </Badge>
                        )}
                        <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">
                          {title}
                        </h2>
                      </div>

                      <div className="flex items-center gap-2 text-muted-foreground mb-3">
                        <Banknote className="h-4 w-4" />
                        <span className="text-sm">Total Orders</span>
                      </div>

                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold">
                          {stock.totalOrders.toLocaleString()}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          orders
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

const EmptyState = memo(
  ({
    refetch,
    isRefetching,
  }: {
    refetch: () => void;
    isRefetching: boolean;
  }) => {
    const { toast } = useToast();
    return (
      <div className="text-center py-12">
        <div className="w-full flex justify-center mb-6">
          <div className="rounded-full bg-muted p-6">
            <PackageSearch className="w-12 h-12 text-muted-foreground" />
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-2">No Markets Available</h3>
        <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
          There are currently no trading markets available. Please check back
          later or refresh to check for updates.
        </p>
        <Button
          variant="outline"
          onClick={() => {
            refetch();
            toast({ title: "Data Refreshed!" });
          }}
          disabled={isRefetching}
          className="gap-2 min-w-[140px]"
        >
          <RefreshCcw
            className={`w-4 h-4 ${isRefetching ? "animate-spin" : ""}`}
          />
          {isRefetching ? "Refreshing..." : "Refresh Markets"}
        </Button>
      </div>
    );
  }
);

EmptyState.displayName = "EmptyState";
