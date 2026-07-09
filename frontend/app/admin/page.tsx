"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { ProtectedRoute } from "../../components/common/ProtectedRoute";
import { api } from "../../lib/api";
import { ApiResponse, DashboardStats, Order, Product, User, Vendor } from "../../types";

type Tab = "overview" | "vendors" | "products" | "users" | "orders";

interface VendorForm {
  shopName: string;
  ownerName: string;
  address: string;
  phone: string;
  category: string;
  image?: string;
}

interface ProductForm {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image?: string;
  vendor: string;
  featured: boolean;
}

export default function AdminDashboardPage() {
  const [tab, setTab] = useState<Tab>("overview");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const vendorForm = useForm<VendorForm>();
  const productForm = useForm<ProductForm>({ defaultValues: { featured: false } });

  const loadAll = async () => {
    const [statsRes, vendorsRes, productsRes, usersRes, ordersRes] = await Promise.all([
      api.get<ApiResponse<DashboardStats>>("/admin/stats"),
      api.get<ApiResponse<Vendor[]>>("/vendors"),
      api.get<ApiResponse<Product[]>>("/products"),
      api.get<ApiResponse<User[]>>("/users"),
      api.get<ApiResponse<Order[]>>("/orders"),
    ]);
    setStats(statsRes.data.data);
    setVendors(vendorsRes.data.data);
    setProducts(productsRes.data.data);
    setUsers(usersRes.data.data);
    setOrders(ordersRes.data.data);
  };

  useEffect(() => {
    void loadAll();
  }, []);

  const submitVendor = vendorForm.handleSubmit(async (values) => {
    await api.post("/vendors", values);
    vendorForm.reset();
    toast.success("Vendor created");
    await loadAll();
  });

  const submitProduct = productForm.handleSubmit(async (values) => {
    await api.post("/products", values);
    productForm.reset();
    toast.success("Product created");
    await loadAll();
  });

  const statuses = useMemo(
    () => ["pending", "confirmed", "shipped", "delivered", "cancelled"] as const,
    []
  );

  return (
    <ProtectedRoute role="admin">
      <div className="container py-10">
        <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
        <div className="mt-6 flex flex-wrap gap-2">
          {(["overview", "vendors", "products", "users", "orders"] as Tab[]).map((name) => (
            <button
              type="button"
              key={name}
              onClick={() => setTab(name)}
              className={`rounded-full px-4 py-2 text-sm ${
                tab === name ? "bg-green-700 text-white" : "bg-white text-slate-700"
              }`}
            >
              {name}
            </button>
          ))}
        </div>

        {tab === "overview" && stats && (
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {[
              { label: "Products", value: stats.totalProducts },
              { label: "Vendors", value: stats.totalVendors },
              { label: "Users", value: stats.totalUsers },
              { label: "Orders", value: stats.totalOrders },
            ].map((card) => (
              <div key={card.label} className="rounded-2xl bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-600">{card.label}</p>
                <p className="mt-2 text-3xl font-semibold text-green-700">{card.value}</p>
              </div>
            ))}
          </div>
        )}

        {tab === "vendors" && (
          <div className="mt-6 space-y-5">
            <form onSubmit={submitVendor} className="grid gap-3 rounded-2xl bg-white p-5 shadow-sm md:grid-cols-3">
              <input {...vendorForm.register("shopName")} required placeholder="Shop name" className="rounded-xl border px-3 py-2" />
              <input {...vendorForm.register("ownerName")} required placeholder="Owner name" className="rounded-xl border px-3 py-2" />
              <input {...vendorForm.register("address")} required placeholder="Address" className="rounded-xl border px-3 py-2" />
              <input {...vendorForm.register("phone")} required placeholder="Phone" className="rounded-xl border px-3 py-2" />
              <input {...vendorForm.register("category")} required placeholder="Category" className="rounded-xl border px-3 py-2" />
              <button className="rounded-xl bg-green-700 px-4 py-2 text-white">Add Vendor</button>
            </form>
            <div className="overflow-x-auto rounded-2xl bg-white p-5 shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="py-2">Shop</th>
                    <th>Owner</th>
                    <th>Category</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {vendors.map((vendor) => (
                    <tr key={vendor._id} className="border-b">
                      <td className="py-2">{vendor.shopName}</td>
                      <td>{vendor.ownerName}</td>
                      <td>{vendor.category}</td>
                      <td className="space-x-2">
                        <button
                          type="button"
                          className="text-blue-600"
                          onClick={async () => {
                            const shopName = window.prompt("Update shop name", vendor.shopName);
                            if (!shopName) return;
                            await api.put(`/vendors/${vendor._id}`, { ...vendor, shopName });
                            await loadAll();
                          }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="text-red-600"
                          onClick={async () => {
                            await api.delete(`/vendors/${vendor._id}`);
                            await loadAll();
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "products" && (
          <div className="mt-6 space-y-5">
            <form onSubmit={submitProduct} className="grid gap-3 rounded-2xl bg-white p-5 shadow-sm md:grid-cols-3">
              <input {...productForm.register("name")} required placeholder="Name" className="rounded-xl border px-3 py-2" />
              <input {...productForm.register("description")} required placeholder="Description" className="rounded-xl border px-3 py-2" />
              <input {...productForm.register("price", { valueAsNumber: true })} type="number" required placeholder="Price" className="rounded-xl border px-3 py-2" />
              <input {...productForm.register("category")} required placeholder="Category" className="rounded-xl border px-3 py-2" />
              <input {...productForm.register("stock", { valueAsNumber: true })} type="number" required placeholder="Stock" className="rounded-xl border px-3 py-2" />
              <select {...productForm.register("vendor")} required className="rounded-xl border px-3 py-2">
                <option value="">Select vendor</option>
                {vendors.map((vendor) => (
                  <option key={vendor._id} value={vendor._id}>
                    {vendor.shopName}
                  </option>
                ))}
              </select>
              <label className="col-span-full flex items-center gap-2 text-sm text-slate-600">
                <input type="checkbox" {...productForm.register("featured")} />
                Featured Product
              </label>
              <button className="rounded-xl bg-green-700 px-4 py-2 text-white">Add Product</button>
            </form>
            <div className="overflow-x-auto rounded-2xl bg-white p-5 shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="py-2">Name</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id} className="border-b">
                      <td className="py-2">{product.name}</td>
                      <td>₹{product.price}</td>
                      <td>{product.stock}</td>
                      <td className="space-x-2">
                        <button
                          type="button"
                          className="text-blue-600"
                          onClick={async () => {
                            const name = window.prompt("Update product name", product.name);
                            if (!name) return;
                            await api.put(`/products/${product._id}`, {
                              ...product,
                              name,
                              vendor: product.vendor._id,
                            });
                            await loadAll();
                          }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="text-red-600"
                          onClick={async () => {
                            await api.delete(`/products/${product._id}`);
                            await loadAll();
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "users" && (
          <div className="mt-6 overflow-x-auto rounded-2xl bg-white p-5 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-2">Name</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id || user.id} className="border-b">
                    <td className="py-2">{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "orders" && (
          <div className="mt-6 overflow-x-auto rounded-2xl bg-white p-5 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-2">Order</th>
                  <th>User</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b">
                    <td className="py-2">#{order._id.slice(-6)}</td>
                    <td>{order.user?.name || "User"}</td>
                    <td>₹{order.totalPrice}</td>
                    <td>
                      <select
                        value={order.orderStatus}
                        onChange={async (e) => {
                          await api.patch(`/orders/${order._id}/status`, { orderStatus: e.target.value });
                          await loadAll();
                        }}
                        className="rounded-lg border px-2 py-1"
                      >
                        {statuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
