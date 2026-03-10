import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
    subsets: ["latin"],
    weight: ["300", "400", "500", "700", "900"],
    variable: "--font-outfit"
});

export const metadata: Metadata = {
    title: "CandyCake | Premium Rainbow Cakes",
    description: "Experience the most colorful cakes ever made. Freshly baked rainbow cakes with explosive flavors and premium ingredients.",
    openGraph: {
        title: "CandyCake | Premium Rainbow Cakes",
        description: "Experience the most colorful cakes ever made. Freshly baked rainbow cakes with explosive flavors and premium ingredients.",
        images: ["/hero.jpg"],
    },
    twitter: {
        card: "summary_large_image",
        title: "CandyCake | Premium Rainbow Cakes",
        description: "Experience the most colorful cakes ever made. Freshly baked rainbow cakes with explosive flavors.",
    }
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="scroll-smooth">
            <body className={`${outfit.variable} font-sans antialiased bg-white`}>
                {children}
            </body>
        </html>
    );
}
