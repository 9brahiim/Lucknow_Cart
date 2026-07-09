"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { api } from "../lib/api";
import { ApiResponse, CartItem } from "../types";
import { useAuth } from "./AuthContext";

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  total: number;
  refreshCart: () => Promise<void>;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!user) {
      setItems([]);
      return;
    }
    setLoading(true);
    try {
      const res = await api.get<ApiResponse<CartItem[]>>("/cart");
      setItems(res.data.data);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void refreshCart();
  }, [refreshCart]);

  const addToCart = async (productId: string, quantity = 1) => {
    const res = await api.post<ApiResponse<CartItem[]>>("/cart/items", { productId, quantity });
    setItems(res.data.data);
    toast.success("Item added to cart");
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    const res = await api.put<ApiResponse<CartItem[]>>(`/cart/items/${productId}`, { quantity });
    setItems(res.data.data);
  };

  const removeItem = async (productId: string) => {
    const res = await api.delete<ApiResponse<CartItem[]>>(`/cart/items/${productId}`);
    setItems(res.data.data);
    toast.success("Item removed");
  };

  const clearCart = async () => {
    await api.delete("/cart/clear");
    setItems([]);
  };

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const value = useMemo(
    () => ({ items, loading, total, refreshCart, addToCart, updateQuantity, removeItem, clearCart }),
    [items, loading, refreshCart, total]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
