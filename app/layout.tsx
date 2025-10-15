import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Funnel_Display, Funnel_Sans } from "next/font/google";
import "./globals.css";
import { ContextProvider } from ".";
import ReactQueryProvider from "./ReactQueryProvider";
import Header from "@/components/header";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});
const funnelDisplay = Funnel_Display({
  subsets: ["latin"],
  variable: "--font-funnel-display",
  weight: ["300", "400", "500", "600", "700", "800"],
});
const funnelSans = Funnel_Sans({
  subsets: ["latin"],
  variable: "--font-funnel-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
});

// Website Config
export const metadata: Metadata = {
  title: "Report Card Generator | FileCoin Storage",
  description: "Create, store, and manage academic report cards on the decentralized FileCoin network",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Lobster&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geist.variable} ${geistMono.variable} ${funnelDisplay.variable} ${funnelSans.variable} font-sans`}
      >
        <ReactQueryProvider>
          <ContextProvider>
            <Header />
            {children}
          </ContextProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
