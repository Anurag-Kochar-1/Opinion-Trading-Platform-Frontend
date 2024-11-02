"use client";

import { TrendingUp, ArrowRight, DollarSign, BarChart2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useUser } from "@/services/user/queries";
import { useStore } from "@/store";
import { Skeleton } from "./ui/skeleton";
import BlurIn from "./ui/blur-in";
import NumberTicker from "./ui/number-ticker";
import PulsatingButton from "./ui/pulsating-button";
import BlurFade from "./ui/blur-fade";

const symbols: Array<string> = ["AAPL", "GOOGL", "AMZN", "MSFT", "TSLA"];
const BLUR_FADE_DELAY = 0.25;

export function Hero() {
  const [tickerSymbol, setTickerSymbol] = useState("AAPL");
  const { data: user, isLoading: isUserLoading } = useUser();
  const hasUserIdHydrated = useStore((state) => state.hasUserIdHydrated);
  const setIsSignUpModalOpen = useStore((state) => state.setIsSignUpModalOpen);

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerSymbol(symbols[Math.floor(Math.random() * symbols.length)]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pt-16 pb-12 mb-12 bg-gradient-to-b from-background to-background/80">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <BlurFade delay={BLUR_FADE_DELAY} inView>
            <div className="inline-flex items-center justify-center p-2 mb-6 rounded-full bg-primary/10 text-primary animate-pulse">
              <TrendingUp className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">
                Opinion Trading Markets
              </span>
            </div>
          </BlurFade>

          <BlurFade delay={BLUR_FADE_DELAY} inView>
            <BlurIn
              word="Trade Your Market Predictions"
              className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60"
            />
            <BlurIn
              word="Explore diverse stock symbols and participate in market predictions. Your opinion could be the next winning trade."
              className="!text-lg !lg:text-xl !text-muted-foreground !font-medium !lg:font-semibold !max-w-2xl !mx-auto !mb-8"
            />
          </BlurFade>

          <BlurFade delay={BLUR_FADE_DELAY} inView>
            <div className="flex justify-center flex-col sm:flex-row items-center gap-4 mb-8">
              {!hasUserIdHydrated || isUserLoading ? (
                <Skeleton className="w-full sm:w-32 h-10" />
              ) : user?.statusCode === 200 ? null : (
                <PulsatingButton
                  pulseColor="#1BA54E"
                  className="w-full sm:w-max"
                  onClick={() => setIsSignUpModalOpen(true)}
                >
                  Get Started
                </PulsatingButton>
              )}

              <Button
                size="lg"
                variant={user?.statusCode !== 200 ? "secondary" : "default"}
                className="group w-full sm:w-max"
                asChild
              >
                <Link href={`#markets`}>
                  View All Markets
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </BlurFade>

          <BlurFade delay={BLUR_FADE_DELAY} inView>
            <div className="flex justify-center items-center space-x-8 text-muted-foreground">
              <div className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-primary" />
                <span>
                  <NumberTicker
                    value={100}
                    className="!text-muted-foreground"
                  />{" "}
                  + Markets
                </span>
              </div>
              <div className="flex items-center">
                <BarChart2 className="w-5 h-5 mr-2 text-primary" />
                <span>Real-time Data</span>
              </div>
            </div>
          </BlurFade>
        </div>
      </div>

      <BlurFade delay={BLUR_FADE_DELAY} inView>
        <div className="mt-12 text-center animate-bounce">
          <span className="text-2xl font-semibold text-primary">
            {tickerSymbol}
          </span>
        </div>
      </BlurFade>
    </div>
  );
}
