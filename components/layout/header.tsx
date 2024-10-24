"use client";
import React from "react";
import { Logo } from "./logo";
import { Button } from "../ui/button";
import { useStore } from "@/store";
import { Skeleton } from "../ui/skeleton";
import { useUserBalance } from "@/services/user/queries";
import { Wallet } from "lucide-react";

export const Header = () => {
  const userId = useStore((state) => state.userId);
  const removeUserId = useStore((state) => state.removeUserId);
  const hasUserIdHydrated = useStore((state) => state.hasUserIdHydrated);
  const setIsSignUpModalOpen = useStore((state) => state.setIsSignUpModalOpen);
  const {
    data: userBalance,
    isLoading: isUserBalanceLoading,
    isError: isUserBalanceError,
    error: userBalanceError,
  } = useUserBalance();
  return (
    <div className="w-full border-b border-border sticky top-0 left-0 right-0 px-4 lg:px-6 bg-background">
      <div className="container mx-auto flex justify-between items-center h-14">
        <Logo />
        {userId && <Button onClick={removeUserId} variant={"destructive"}> Sign Out </Button> }

        {!hasUserIdHydrated ? (
          <Skeleton className="w-24 h-9" />
        ) : userId ? (
          isUserBalanceLoading ? (
            <Skeleton className="w-24 h-9" />
          ) : isUserBalanceError ? userBalanceError?.message || "ERROR" : <Button variant={"secondary"} > <Wallet size={15} />  ₹ {userBalance?.data?.balance ?? "ERROR"} </Button>
        ) : (
          <Button onClick={() => setIsSignUpModalOpen(true)}>
            Get Started
          </Button>
        )}


      </div>
    </div>
  );
};
