import type { Metadata } from "next";
import { Funnel_Sans } from "next/font/google";
import "./globals.css";
import { ContextProvider } from ".";
import ReactQueryProvider from "./ReactQueryProvider";
import Header from "@/components/header";

const primaryFont = Funnel_Sans({
  subsets: ["latin"],
  variable: "--font-primary",
  weight: ["300", "400", "500", "600", "700", "800"],
});

// Website Config
export const metadata: Metadata = {
  title: "IntelliX | Report Card Generator on FileCoin",
  description: "Create, store, and manage academic report cards on the decentralized FileCoin network with IntelliX",
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
      </head>
      <body className={`${primaryFont.variable} font-primary antialiased`}>
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
