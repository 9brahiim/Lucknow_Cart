"use client";

import { useEffect, useState } from "react";
import { ProtectedRoute } from "../../components/common/ProtectedRoute";
import { api } from "../../lib/api";
import { ApiResponse, Order } from "../../types";

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await api.get<ApiResponse<Order[]>>("/orders/my");
        setOrders(res.data.data);
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, []);

  return (
    <ProtectedRoute>
      <div className="container py-12">
        <h1 className="text-3xl font-semibold">Order History</h1>
        {loading ? (
          <p className="mt-6">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="mt-6 text-slate-600">No orders found.</p>
        ) : (
          <div className="mt-6 space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="rounded-2xl bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-semibold">Order #{order._id.slice(-6)}</p>
                  <p className="text-sm text-slate-600">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <p className="mt-2 text-sm text-slate-700">Status: {order.orderStatus}</p>
                <p className="text-sm text-slate-700">Total: ₹{order.totalPrice}</p>
                <ul className="mt-3 list-disc pl-5 text-sm text-slate-600">
                  {order.products.map((item, idx) => (
                    <li key={`${order._id}-${idx}`}>
                      {item.name} x {item.quantity}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
