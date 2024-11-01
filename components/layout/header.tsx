"use client";
import React, { useEffect } from "react";
import { Logo } from "./logo";
import { Button } from "../ui/button";
import { useStore } from "@/store";
import { Skeleton } from "../ui/skeleton";
import { useUser, useUserBalance } from "@/services/user/queries";
import { Menu, Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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
    if (user?.statusCode === 404) {
      removeUserId();
      toast({ title: "Logged out!" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUserLoading]);

  const NavigationContent = ({ isMobile = false }) => (
    <div
      className={`flex ${
        isMobile ? "flex-col space-y-4" : "flex-row items-center"
      } gap-4`}
    >
      {user?.statusCode === 200 ? (
        <Link href="/portfolio" className={isMobile ? "w-full" : ""}>
          <Button variant="ghost" className={isMobile ? "w-full" : ""}>
            Portfolio
          </Button>
        </Link>
      ) : null}

      {!hasUserIdHydrated ? (
        <Skeleton className="w-24 h-9" />
      ) : user?.statusCode === 200 ? (
        isUserBalanceLoading ? (
          <Skeleton className="w-24 h-9" />
        ) : isUserBalanceError ? (
          userBalanceError?.message
        ) : (
          <div className="px-4 py-2 bg-muted flex justify-center items-center gap-2">
            <Wallet size={15} />
            <span>₹ {userBalance?.data?.balance ? userBalance?.data?.balance / 100 : "-"}</span>
          </div>
        )
      ) : (
        <Button
          onClick={() => setIsSignUpModalOpen(true)}
          className={isMobile ? "w-full" : ""}
        >
          Get Started
        </Button>
      )}

      {user?.statusCode === 200 ? (
        <Button
          variant="secondary"
          onClick={() => setIsOnrampBalanceModalOpen(true)}
          className={isMobile ? "w-full" : ""}
        >
          Recharge
        </Button>
      ) : null}

      {user?.statusCode === 200 ? (
        <Button
          onClick={logOut}
          variant="destructive"
          className={isMobile ? "w-full" : ""}
        >
          Sign Out
        </Button>
      ) : null}
    </div>
  );

  return (
    <div className="w-full border-b border-border sticky top-0 left-0 right-0 px-4 lg:px-6 bg-background z-50">
      <div className="container mx-auto flex justify-between items-center h-16">
        <Logo />

        {/* Desktop Navigation */}
        <div className="hidden md:flex">
          <NavigationContent />
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <NavigationContent isMobile={true} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};
