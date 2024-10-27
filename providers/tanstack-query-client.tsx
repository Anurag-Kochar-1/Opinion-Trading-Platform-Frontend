"use client";
import React, { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError(error) {
        console.log(error);
        toast({
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          title: error?.response?.data?.statusMessage || "Error",
          variant: "destructive",
        });
      },
      onSuccess(data) {
        console.log(data);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (data.statusMessage) {
          toast({
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            title: data?.statusMessage,
            variant: "success",
          });
        }
      },
    },
  },
});
export const TanstackQueryClientProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
