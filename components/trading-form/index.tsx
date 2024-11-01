"use client";
import { FC, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MinusIcon, PlusIcon } from "lucide-react";
import { MAX_PRICE, TradingFormValues, tradingSchema } from "./schema";
import { cn } from "@/lib/utils";
import { useAddOrderMutation } from "@/services/order/mutations";
import { useStore } from "@/store";
import { useParams } from "next/navigation";
import {
  useUserBalance,
  useUserStockBalanceByStockSymbol,
} from "@/services/user/queries";
import { StockBalance as StockBalanceType } from "@/types";
import { Separator } from "../ui/separator";
import { useToast } from "@/hooks/use-toast";

export const TradingForm: FC = () => {
  const { id } = useParams();
  const stockSymbol = String(id);
  const { toast } = useToast();
  const [type, setType] = useState<"place" | "exit">("place");
  const [activeTab, setActiveTab] = useState<"yes" | "no">("yes");
  const userId = useStore((state) => state.userId);

  const form = useForm<TradingFormValues>({
    resolver: zodResolver(tradingSchema),
    defaultValues: {
      price: 6.5,
      quantity: 1,
    },
  });

  const { watch, setValue } = form;
  const price = watch("price");
  const quantity = watch("quantity");

  const totalCost = useMemo(() => {
    return price * quantity;
  }, [price, quantity]);

  const { data: stockBalance, isLoading: isStockBalanceLoading } =
    useUserStockBalanceByStockSymbol({ stockSymbol });
  const { data: userBalance } = useUserBalance();

  const adjustPrice = (increment: boolean) => {
    const currentPrice = Number(price);
    const newPrice = increment ? currentPrice + 0.5 : currentPrice - 0.5;
    if (newPrice >= 0.5 && newPrice <= MAX_PRICE) {
      setValue("price", Number(newPrice.toFixed(1)), {
        shouldValidate: true,
      });
    }
  };

  const adjustQuantity = (increment: boolean) => {
    const currentQuantity = Number(quantity);
    const newQuantity = increment ? currentQuantity + 1 : currentQuantity - 1;
    if (newQuantity >= 1 && newQuantity <= 999) {
      setValue("quantity", newQuantity, {
        shouldValidate: true,
      });
    }
  };

  const calculateTotals = () => {
    const currentPrice = Number(price);
    const currentQuantity = Number(quantity);
    const youPut = currentPrice * currentQuantity;

    const youGet =
      activeTab === "yes"
        ? (10 - currentPrice) * currentQuantity
        : currentPrice * currentQuantity;

    return {
      youPut: Number(youPut.toFixed(1)),
      youGet: Number(youGet.toFixed(1)),
    };
  };

  const { youPut, youGet } = calculateTotals();

  const addOrderMutation = useAddOrderMutation();

  const onSubmit = (values: TradingFormValues) => {
    if (type === "place") {
      if (!userBalance?.data) {
        alert("Use balance not loaded! Please try again.");
        return;
      }
      const priceInPaise = values.price * 100;
      const totalCost = priceInPaise * values.quantity;
      if (totalCost > userBalance?.data?.balance) {
        toast({
          title: "Low Balance!",
          variant: "destructive",
        });
        return;
      }
    } else if (type === "exit") {
      if (!stockBalance?.data) {
        alert("User Stock Balance Not Loaded, Please try again!");
        return;
      }
      if (
        activeTab === "yes" &&
        values.quantity > stockBalance?.data?.yes?.quantity
      ) {
        toast({
          title: `You don't have ${values.quantity} ${activeTab} stocks to sell`,
          variant: "destructive",
        });
        return;
      } else if (
        activeTab === "no" &&
        values.quantity > stockBalance?.data?.no?.quantity
      ) {
        toast({
          title: `You don't have ${values.quantity} ${activeTab} stocks to sell`,
          variant: "destructive",
        });
        return;
      }
    }

    addOrderMutation.mutate({
      price: values.price,
      quantity: values.quantity,
      stockSymbol: stockSymbol.toString(),
      stockType: activeTab === "yes" ? "yes" : "no",
      orderType: type === "place" ? "buy" : "sell",
      userId,
    });
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* ========== type ========== */}
            <Tabs
              defaultValue="place"
              className="w-full"
              onValueChange={(value) => setType(value as "place" | "exit")}
            >
              <TabsList className="grid grid-cols-2 w-full rounded-xl h-14">
                <TabsTrigger
                  value="place"
                  className="font-semibold rounded-l-xl py-3.5"
                >
                  BUY
                </TabsTrigger>
                <TabsTrigger
                  value="exit"
                  className="font-semibold rounded-r-xl py-3.5"
                >
                  SELL
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* ========== stock type ========== */}
            <Tabs
              defaultValue="yes"
              className="w-full"
              onValueChange={(value) => setActiveTab(value as "yes" | "no")}
            >
              <TabsList className="grid grid-cols-2 w-full rounded-xl h-14">
                <TabsTrigger
                  value="yes"
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white font-semibold rounded-l-xl py-3.5"
                >
                  Yes
                </TabsTrigger>
                <TabsTrigger
                  value="no"
                  className="data-[state=active]:bg-red-500 data-[state=active]:text-white font-semibold rounded-r-xl py-3.5"
                >
                  No
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="space-y-4 p-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center space-x-2">
                      <span className="min-w-[4rem] font-medium">Price</span>
                      <div className="flex items-center w-32">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="rounded-r-none !aspect-square"
                          onClick={() => adjustPrice(false)}
                          disabled={price <= 0.5}
                        >
                          <MinusIcon className="h-4 w-4" />
                        </Button>
                        <FormControl>
                          <Input
                            {...field}
                            className="rounded-none text-center"
                            type="number"
                            step="0.5"
                            min="0.5"
                            max={MAX_PRICE}
                            onChange={(e) => {
                              const value = Number(e.target.value);
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="rounded-l-none !aspect-square"
                          onClick={() => adjustPrice(true)}
                          disabled={price >= MAX_PRICE}
                        >
                          <PlusIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center space-x-2">
                      <span className="min-w-[4rem] font-medium">Quantity</span>
                      <div className="flex items-center w-32">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="rounded-r-none !aspect-square"
                          onClick={() => adjustQuantity(false)}
                          disabled={quantity <= 1}
                        >
                          <MinusIcon className="h-4 w-4" />
                        </Button>
                        <FormControl>
                          <Input
                            {...field}
                            className="focus-visible:ring-0 rounded-none text-center"
                            type="number"
                            min="1"
                            max="999"
                            onChange={(e) => {
                              const value = parseInt(e.target.value, 10);
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="rounded-l-none !aspect-square"
                          onClick={() => adjustQuantity(true)}
                          disabled={quantity >= 999}
                        >
                          <PlusIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {type === "place" ? (
                <div className="flex justify-between text-sm mx-auto w-[70%] py-2">
                  <div className="space-y-1">
                    <p className="text-muted-foreground">You put</p>
                    <p className="font-medium">₹{youPut.toFixed(1)}</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-muted-foreground">You get</p>
                    <p className="font-medium text-green-600">
                      ₹{youGet.toFixed(1)}
                    </p>
                  </div>
                </div>
              ) : null}

              <p className="font-medium">
                {" "}
                Total order {type === "place" ? "cost" : "value"} will be{" "}
                {totalCost}{" "}
              </p>

              {type === "exit" ? (
                isStockBalanceLoading ? null : stockBalance?.statusCode ===
                  200 ? (
                  <>
                    <Separator orientation="horizontal" />
                    <StockBalance
                      stockBalance={stockBalance?.data as StockBalanceType}
                    />
                  </>
                ) : null
              ) : null}

              <Button
                type="submit"
                size={"lg"}
                className={cn("w-full font-semibold h-12", {
                  "bg-blue-500 hover:bg-blue-600": activeTab === "yes",
                  "bg-red-500 hover:bg-red-600": activeTab === "no",
                })}
              >
                {type == "place" ? "Place" : "Exit"} order
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

function StockBalance({ stockBalance }: { stockBalance: StockBalanceType }) {
  return (
    <Card className="w-full p-0 border-none">
      <CardHeader className="p-0 py-2">
        <CardTitle className="text-lg font-bold">Stock Balance</CardTitle>
      </CardHeader>
      <CardContent className="p-0 pb-2">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-base font-semibold">Yes</span>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Quantity:{" "}
                <span className="font-medium text-foreground">
                  {stockBalance?.yes?.quantity}
                </span>
              </p>
              <p className="text-sm text-muted-foreground flex items-center">
                Locked:{" "}
                <span className="font-medium text-foreground ml-1">
                  {stockBalance.yes?.locked}
                </span>
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-base font-semibold">No</span>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Quantity:{" "}
                <span className="font-medium text-foreground">
                  {stockBalance?.no?.quantity}
                </span>
              </p>
              <p className="text-sm text-muted-foreground flex items-center">
                Locked:{" "}
                <span className="font-medium text-foreground ml-1">
                  {stockBalance?.no?.locked}
                </span>
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
