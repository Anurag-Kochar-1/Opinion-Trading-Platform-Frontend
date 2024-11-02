"use client";
import { Orderbook } from "@/components/orderbook";
import { TradingForm } from "@/components/trading-form";
import { useUser } from "@/services/user/queries";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useParams } from "next/navigation";
import { LogIn } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useStore } from "@/store";

function Page() {
  const {
    data: user,
    isLoading: isUserLoading,
    isError: isUserError,
    error: userError,
  } = useUser();
  const hasUserIdHydrated = useStore((state) => state.hasUserIdHydrated);
  const { id } = useParams();
  return (
    <div className="container mx-auto p-4 min-h-screen">
      <div className="mb-8 py-4 w-full">
        <h1 className="text-2xl font-bold mb-4">
          {id.toString().split("_").join(" ")}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 xl:gap-8">
          <div className="col-span-full lg:col-span-3 xl:col-span-4">
            <Orderbook />
          </div>

          <div className="w-full col-span-full lg:col-span-3 xl:col-span-2">
            {!hasUserIdHydrated || isUserLoading  || true ? (
              <Skeleton className="w-full min-h-44" />
            ) : isUserError ? (
              userError?.message
            ) : user?.statusCode === 200 ? (
              <TradingForm />
            ) : (
              <Alert className="w-full">
                <LogIn className="h-4 w-4" />
                <AlertTitle>Sign Up Required!</AlertTitle>
                <AlertDescription>
                  Please create an account to start trading!
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
