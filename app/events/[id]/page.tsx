"use client";
import { Orderbook } from "@/components/orderbook";
import { TradingForm } from "@/components/trading-form";
import { useUser } from "@/services/user/queries";
import { useParams } from "next/navigation";

function Page() {
  const { data: user } = useUser();
  const { id } = useParams();
  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">{id}</h1>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <Orderbook />
          </div>
          <div className="w-full md:w-96">
            {user?.statusCode === 200 ? <TradingForm /> : "Sign In First"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
