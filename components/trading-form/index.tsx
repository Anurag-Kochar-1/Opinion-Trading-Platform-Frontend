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
import { CheckCircle, Lock, MinusIcon, PlusIcon, XCircle } from "lucide-react";
import { MAX_PRICE, TradingFormValues, tradingSchema } from "./schema";
import { cn } from "@/lib/utils";
import { useAddOrderMutation } from "@/services/order/mutations";
import { useStore } from "@/store";
import { useParams } from "next/navigation";
import { useUserStockBalanceByStockSymbol } from "@/services/user/queries";
import { StockBalance as StockBalanceType } from "@/types";

export const TradingForm: FC = () => {
  const { id } = useParams();
  const stockSymbol = String(id);
  const [type, setType] = useState<"place" | "exit">("place");
  const [activeTab, setActiveTab] = useState<"yes" | "no">("yes");
  const userId = useStore((state) => state.userId);

  const form = useForm<TradingFormValues>({
    resolver: zodResolver(tradingSchema),
    defaultValues: {
      price: 4.5,
      quantity: 3,
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
    console.log(`type`, type);
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
    <Card className="w-full lg:max-w-md">
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
                  Place
                </TabsTrigger>
                <TabsTrigger
                  value="exit"
                  className="font-semibold rounded-r-xl py-3.5"
                >
                  Exit
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
                  Yes ₹4.5
                </TabsTrigger>
                <TabsTrigger
                  value="no"
                  className="data-[state=active]:bg-red-500 data-[state=active]:text-white font-semibold rounded-r-xl py-3.5"
                >
                  No ₹5.5
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
                  <StockBalance
                    stockBalance={stockBalance?.data as StockBalanceType}
                  />
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
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Stock Balance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-6 w-6 text-green-500" />
              <span className="text-lg font-semibold">Yes</span>
            </div>
            <div className="pl-8 space-y-2">
              <p className="text-sm text-muted-foreground">
                Quantity:{" "}
                <span className="font-medium text-foreground">
                  {stockBalance?.yes?.quantity}
                </span>
              </p>
              <p className="text-sm text-muted-foreground flex items-center">
                <Lock className="h-4 w-4 mr-1 text-orange-500" />
                Locked:{" "}
                <span className="font-medium text-foreground ml-1">
                  {stockBalance.yes?.locked}
                </span>
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <XCircle className="h-6 w-6 text-red-500" />
              <span className="text-lg font-semibold">No</span>
            </div>
            <div className="pl-8 space-y-2">
              <p className="text-sm text-muted-foreground">
                Quantity:{" "}
                <span className="font-medium text-foreground">
                  {stockBalance?.no?.quantity}
                </span>
              </p>
              <p className="text-sm text-muted-foreground flex items-center">
                <Lock className="h-4 w-4 mr-1 text-orange-500" />
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
