"use client";
import { Orderbook } from "@/components/orderbook";
import { TradingForm } from "@/components/trading-form";
import { useUser } from "@/services/user/queries";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useParams } from "next/navigation";
import { LogIn } from "lucide-react";

function Page() {
  const { data: user } = useUser();
  const { id } = useParams();
  return (
    <div className="container mx-auto p-4">
      <div className="mb-8 py-4">
        <h1 className="text-2xl font-bold mb-4">
          {id.toString().split("_").join(" ")}
        </h1>
        <div className="flex flex-col md:flex-row gap-4 xl:gap-8">
          <div className="flex-1 w-full">
            <Orderbook />
          </div>
          <div className="w-full md:w-96">
            {user?.statusCode === 200 ? (
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
