import type { Metadata } from "next";
import "./globals.css";
import ClientBody from "./ClientBody";

export const metadata: Metadata = {
  title: "OUTTERSPACE - Luxury Fashion",
  description: "Outterspace Luxury redefines elegance with premium T-shirts, shirts, sunglasses, and fashion accessories. Where modern fashion meets timeless design.",
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
