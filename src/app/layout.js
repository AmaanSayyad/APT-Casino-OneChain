import { Inter } from "next/font/google";
import "@/styles/globals.css";
import Providers from "./providers";
import Navbar from "@/components/Navbar.js";
import Footer from "@/components/Footer";
import GlobalWalletManager from "@/components/GlobalWalletManager";
import NetworkSwitcher from "@/components/NetworkSwitcher";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "OneArcade",
  description: "OneArcade - On-chain provably fair gaming on One Chain Network",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" sizes="512x512" href="/favicon.png" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon.png" />
        <link
          rel="preload"
          href="/fonts/ClashDisplay-Variable.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/PlusJakartaSans VariableFont.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body 
        className={`${inter.className} overflow-x-hidden w-full`}
        suppressHydrationWarning={true}
      >
        <Providers>
          <GlobalWalletManager />
          <NetworkSwitcher />
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
