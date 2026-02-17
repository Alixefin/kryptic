"use client";

import { useEffect } from "react";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { ThemeProvider } from "@/context/ThemeContext";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import CartDrawer from "@/components/CartDrawer";

export default function ClientBody({
  children,
}: {
  children: React.ReactNode;
}) {
  // Remove any extension-added classes during hydration
  useEffect(() => {
    document.body.className = "antialiased";
  }, []);

  return (
    <body className="antialiased">
      <ConvexClientProvider>
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              {children}
              <CartDrawer />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </ConvexClientProvider>
    </body>
  );
}
