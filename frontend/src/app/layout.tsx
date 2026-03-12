import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

const outfit = Outfit({
    subsets: ["latin"],
    weight: ["300", "400", "500", "700", "900"],
    variable: "--font-outfit"
});

export const metadata: Metadata = {
  title: "CandyCake | Premium Bespoke Cakery",
  description: "Experience the art of fine baking. Handcrafted, bespoke cakes for every celebration, delivered fresh across the city.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable}`}>
      <body className={`${outfit.className} bg-[#FFFFFF] text-[#444444] antialiased`}>
        <CartProvider>
            {children}
        </CartProvider>
      </body>
    </html>
  );
}
