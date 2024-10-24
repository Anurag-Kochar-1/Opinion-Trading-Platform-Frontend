"use client";
import React from "react";
import { Logo } from "./logo";
import { Button } from "../ui/button";
import { useStore } from "@/store";
import { Skeleton } from "../ui/skeleton";

export const Header = () => {
  const userId = useStore((state) => state.userId);
  const hasUserIdHydrated = useStore((state) => state.hasUserIdHydrated);
  const setIsSignUpModalOpen = useStore((state) => state.setIsSignUpModalOpen);
  return (
    <div className="w-full border-b border-border sticky top-0 left-0 right-0 px-4 lg:px-6 bg-background">
      <div className="container mx-auto flex justify-between items-center h-14">
        <Logo />

        {!hasUserIdHydrated ? (
          <Skeleton className="w-24 h-9" />
        ) : userId ? (
          <div className="cursor-pointer">INR 100</div>
        ) : (
          <Button onClick={() => setIsSignUpModalOpen(true)}>
            Get Started
          </Button>
        )}
      </div>
    </div>
  );
};
