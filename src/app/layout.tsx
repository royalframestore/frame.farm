import type { Metadata } from "next";
import { Barlow, Cormorant_Garamond } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/context/AuthContext";
import AuthModal from "@/components/auth/AuthModal";
import CartSidebar from "@/components/layout/CartSidebar";
import WhatsAppButton from "@/components/layout/WhatsAppButton";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-barlow",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

export const metadata: Metadata = {
  title: "Frame.Farm | Engineering Visual Perfection",
  description: "Premium automotive collectible display frames.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${barlow.variable} ${cormorant.variable} font-barlow antialiased min-h-screen flex flex-col bg-royal-cream text-royal-black`}
      >
        <Script
          id="razorpay-checkout-js"
          src="https://checkout.razorpay.com/v1/checkout.js"
        />
        <AuthProvider>
          <Navbar />
          <CartSidebar />
          <AuthModal />
          <main className="flex-grow pt-24">
            {children}
          </main>
          <WhatsAppButton />
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
