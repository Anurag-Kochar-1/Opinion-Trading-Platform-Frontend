import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import localFont from "next/font/local";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { SignUpFormModal } from "@/components/auth/signup-form-modal";
import { TanstackQueryClientProvider } from "@/providers/tanstack-query-client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { OnrampBalanceFormModal } from "@/components/user/onramp-balance-form-modal";
import { WebSocketProvider } from "@/providers/web-socket";
import Footer from "@/components/layout/footer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Opinions Trading",
  description:
    "Explore diverse stock symbols and participate in market predictions. Your opinion could be the next winning trade.",
  creator: "Anurag Kochar",
  publisher: "Anurag Kochar",
  twitter: {
    card: "summary_large_image",
    creatorId: "anurag__kochar",
    creator: "Anurag Kochar",
    title: "Opinions Trading",
    description:
      "Explore diverse stock symbols and participate in market predictions. Your opinion could be the next winning trade.",
  },
  openGraph: {
    type: "website",
    images: ["/images/og.png"],
    title: "Opinions Trading",
    description:
      "Explore diverse stock symbols and participate in market predictions. Your opinion could be the next winning trade.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <TanstackQueryClientProvider>
        <WebSocketProvider>
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <Header />
            {children}
            <Toaster />
            <ReactQueryDevtools
              buttonPosition="bottom-left"
              initialIsOpen={false}
            />
            {/* ***************** Modals ***************** */}
            <SignUpFormModal />
            <OnrampBalanceFormModal />
            {/* ***************** Modals ***************** */}

            <Footer />
          </body>
        </WebSocketProvider>
      </TanstackQueryClientProvider>
    </html>
  );
}
