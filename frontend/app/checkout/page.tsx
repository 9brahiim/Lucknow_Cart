"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, CreditCard, MapPin, Wallet } from "lucide-react";
import { toast } from "react-hot-toast";
import { ProtectedRoute } from "../../components/common/ProtectedRoute";
import { useCart } from "../../context/CartContext";
import { api } from "../../lib/api";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "cod">("upi");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const placeOrder = async () => {
    if (items.length === 0) return;
    setLoading(true);
    try {
      await api.post("/orders/checkout", { address });
      await clearCart();
      setSuccess(true);
      toast.success("Order placed successfully");
      setTimeout(() => {
        router.push("/order-history");
      }, 1200);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="container py-12">
        <h1 className="text-3xl font-bold text-slate-900">Checkout</h1>
        <p className="mt-2 text-sm text-slate-600">Complete your delivery details and place your order.</p>

        {success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card mt-8 rounded-3xl p-10 text-center"
          >
            <CheckCircle2 className="mx-auto text-emerald-600" size={44} />
            <p className="mt-4 text-xl font-semibold text-slate-900">Order confirmed!</p>
            <p className="mt-2 text-sm text-slate-600">Redirecting to your order history...</p>
          </motion.div>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-5">
              <div className="glass-card rounded-2xl p-6">
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <MapPin size={16} className="text-emerald-600" />
                  Delivery Information
                </p>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={5}
                  placeholder="Enter full delivery address"
                  className="input-modern mt-4 resize-none text-sm"
                />
              </div>

              <div className="glass-card rounded-2xl p-6">
                <p className="text-sm font-semibold text-slate-900">Payment Method (Mock)</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {[
                    { id: "upi" as const, label: "UPI", icon: Wallet },
                    { id: "card" as const, label: "Card", icon: CreditCard },
                    { id: "cod" as const, label: "Cash on Delivery", icon: Wallet },
                  ].map((method) => (
                    <button
                      type="button"
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`rounded-2xl border p-3 text-left text-sm transition ${
                        paymentMethod === method.id
                          ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                          : "border-slate-200 bg-white text-slate-600"
                      }`}
                    >
                      <method.icon size={16} className="mb-2" />
                      {method.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <aside className="glass-card h-fit rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-slate-900">Order Summary</h2>
              <p className="mt-2 text-sm text-slate-600">{items.length} items</p>
              <div className="mt-5 border-t border-slate-200 pt-4">
                <div className="flex justify-between text-base font-semibold text-slate-900">
                  <span>Total payable</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
              <button
                type="button"
                disabled={loading || items.length === 0}
                onClick={() => void placeOrder()}
                className="btn-primary mt-6 w-full px-6 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Placing order..." : "Place Order"}
              </button>
            </aside>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
