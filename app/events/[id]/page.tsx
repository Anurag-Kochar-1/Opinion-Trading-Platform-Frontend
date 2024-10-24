// import { OrderBook } from "@/components/orderbook";
import { TradingForm } from "@/components/trading-form";

function Page() {
  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">
          Bitcoin to be priced at 67151.99 USDT or more at 01:30 PM?
        </h1>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            {/* <OrderBook /> */}
          </div>
          <div className="w-full md:w-96">
            <TradingForm />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
