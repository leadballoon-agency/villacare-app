import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VillaCare - The Future of Villa Services",
  description: "We're building the Fresha for villas. A platform where service providers become business owners, and villa owners get everything they need in one place.",
  openGraph: {
    title: "VillaCare - Investment Opportunity",
    description: "The future of villa services in Europe. From cleaning platform to full-service marketplace.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
