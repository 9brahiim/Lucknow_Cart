"use client";

import { Toaster } from "react-hot-toast";
import { AuthProvider } from "../../context/AuthContext";
import { CartProvider } from "../../context/CartContext";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      <CartProvider>
        {children}
        <Toaster position="top-right" />
      </CartProvider>
    </AuthProvider>
  );
};
