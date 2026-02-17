import type { Metadata } from "next";
import "./globals.css";
import ClientBody from "./ClientBody";

export const metadata: Metadata = {
  title: "KRYPTIC LAB",
  description: "Kryptic redefines elegance with premium T-shirts, shirts, sunglasses, and fashion accessories. Where modern fashion meets timeless design.",
  icons: {
    icon: "/images/hero/logo.png",
    shortcut: "/images/hero/logo.png",
    apple: "/images/hero/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ClientBody>{children}</ClientBody>
    </html>
  );
}
