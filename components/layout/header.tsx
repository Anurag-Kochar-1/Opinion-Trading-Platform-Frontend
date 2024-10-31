"use client";
import React, { useEffect } from "react";
import { Logo } from "./logo";
import { Button } from "../ui/button";
import { useStore } from "@/store";
import { Skeleton } from "../ui/skeleton";
import { useUser, useUserBalance } from "@/services/user/queries";
import { Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";

export const Header = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const removeUserId = useStore((state) => state.removeUserId);
  const hasUserIdHydrated = useStore((state) => state.hasUserIdHydrated);
  const setIsSignUpModalOpen = useStore((state) => state.setIsSignUpModalOpen);

  const setIsOnrampBalanceModalOpen = useStore(
    (state) => state.setIsOnrampBalanceModalOpen
  );

  const {
    data: userBalance,
    isLoading: isUserBalanceLoading,
    isError: isUserBalanceError,
    error: userBalanceError,
  } = useUserBalance();

  const { data: user, isLoading: isUserLoading } = useUser();

  const logOut = () => {
    removeUserId();
    queryClient.removeQueries({ queryKey: ["USER_BALANCE"] });
    queryClient.removeQueries({ queryKey: ["USER"] });
  };

  useEffect(() => {
    if (isUserLoading) return;
    console.log(`user from useEffect`, user);
    if (user?.statusCode === 404) {
      console.log(user);
      removeUserId();
      toast({ title: "Logged out!" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUserLoading]);

  return (
    <div className="w-full border-b border-border sticky top-0 left-0 right-0 px-4 lg:px-6 bg-background">
      <div className="container mx-auto flex justify-between items-center h-16">
        <Logo />

        <div className="flex justify-center items-center gap-2">
          <Link href={`/portfolio`}> Portfolio </Link>

          {!hasUserIdHydrated ? (
            <Skeleton className="w-24 h-9" />
          ) : user?.statusCode === 200 ? (
            isUserBalanceLoading ? (
              <Skeleton className="w-24 h-9" />
            ) : isUserBalanceError ? (
              userBalanceError?.message
            ) : (
              <div className="px-4 py-2 bg-muted flex justify-center items-center gap-2">
                <Wallet size={15} />{" "}
                <span>₹ {userBalance?.data?.balance ?? "-"}</span>
              </div>
            )
          ) : (
            <Button onClick={() => setIsSignUpModalOpen(true)}>
              Get Started
            </Button>
          )}

          {user?.statusCode === 200 ? (
            <Button
              variant={"secondary"}
              onClick={() => setIsOnrampBalanceModalOpen(true)}
            >
              {" "}
              Recharge{" "}
            </Button>
          ) : null}
          {user?.statusCode === 200 ? (
            <Button onClick={logOut} variant={"destructive"}>
              {" "}
              Sign Out{" "}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
};
