"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { ProtectedRoute } from "../../components/common/ProtectedRoute";
import { useCart } from "../../context/CartContext";

const fallbackImage = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800";

export default function CartPage() {
  const { items, total, loading, updateQuantity, removeItem } = useCart();

  return (
    <ProtectedRoute>
      <div className="container py-12">
        <h1 className="text-3xl font-bold text-slate-900">Your Cart</h1>
        <p className="mt-2 text-sm text-slate-600">Review selected items before checkout.</p>

        {loading ? (
          <p className="mt-8 text-slate-600">Loading cart...</p>
        ) : items.length === 0 ? (
          <div className="glass-card mt-8 rounded-3xl p-12 text-center">
            <p className="text-5xl">🛒</p>
            <p className="mt-3 text-lg font-semibold text-slate-900">Your cart is empty</p>
            <p className="mt-1 text-sm text-slate-600">Looks like you haven&apos;t added anything yet.</p>
            <Link href="/products" className="btn-primary mt-6 inline-block px-6 py-3 text-sm">
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.product._id} className="glass-card rounded-2xl p-4">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="relative h-20 w-20 overflow-hidden rounded-xl">
                      <Image
                        src={item.product.image || fallbackImage}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="120px"
                      />
                    </div>
                    <div className="min-w-[180px] flex-1">
                      <h3 className="font-semibold text-slate-900">{item.product.name}</h3>
                      <p className="text-sm text-slate-500">{item.product.category}</p>
                    </div>
                    <p className="font-semibold text-emerald-700">₹{item.product.price}</p>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => void updateQuantity(item.product._id, Number(e.target.value))}
                      className="input-modern w-20 p-2 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => void removeItem(item.product._id)}
                      className="rounded-xl border border-red-200 p-2 text-red-600 hover:bg-red-50"
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <aside className="glass-card h-fit rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-slate-900">Order Summary</h2>
              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>₹0.00</span>
                </div>
              </div>
              <div className="mt-4 border-t border-slate-200 pt-4">
                <div className="flex justify-between text-base font-semibold text-slate-900">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-5">
                <label className="text-xs font-medium text-slate-600">Coupon code</label>
                <div className="mt-2 flex gap-2">
                  <input placeholder="SAVE10" className="input-modern text-sm" />
                  <button type="button" className="btn-secondary px-4 py-2 text-sm">
                    Apply
                  </button>
                </div>
              </div>

              <Link href="/checkout" className="btn-primary mt-6 block px-6 py-3 text-center text-sm">
                Proceed to Checkout
              </Link>
            </aside>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
