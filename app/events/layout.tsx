"use client";

import {
  usePingApiBackendServerQuery,
  usePingEngineServerQuery,
} from "@/services/health/queries";
import Image from "next/image";
import { useMemo } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isError: isEngineError } = usePingEngineServerQuery();
  const { isError: isApiBackendError } = usePingApiBackendServerQuery();

  const failureReason: string = useMemo(() => {
    if (isApiBackendError && !isEngineError) {
      return "Server";
    }
    if (isEngineError && !isApiBackendError) {
      return "Trading Engine";
    }
    if (isApiBackendError && isEngineError) {
      return "Trading Engine and Server";
    }
    return "Trading Engine or Server";
  }, [isApiBackendError, isEngineError]);

  if (isEngineError || isApiBackendError)
    return (
      <div className="min-h-screen p-4 w-full flex-col gap-8 flex justify-start pt-10 items-center">
        <Image
          src={
            "https://media1.tenor.com/m/2gyy4BcsLWsAAAAd/monkey-confused.gif"
          }
          alt="sad-monke"
          width={250}
          height={250}
          quality={50}
          className="max-w-sm"
        />
        <p className="font-semibold text-lg md:text-2xl max-w-sm text-center">
          Our {failureReason} is down. Please try again in a few hours.
        </p>
      </div>
    );

  return children;
}
