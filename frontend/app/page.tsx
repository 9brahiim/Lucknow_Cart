"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, Search, ShieldCheck, Store, Truck } from "lucide-react";
import { ProductCard } from "../components/ui/ProductCard";
import { VendorCard } from "../components/ui/VendorCard";
import { api } from "../lib/api";
import { ApiResponse, Product, Vendor } from "../types";

const categories = [
  { name: "Groceries", icon: "🥦" },
  { name: "Snacks", icon: "🍪" },
  { name: "Clothing", icon: "👕" },
  { name: "Handmade", icon: "🧵" },
  { name: "Spices", icon: "🌶️" },
  { name: "Daily Essentials", icon: "🧴" },
];

const sectionVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [popularVendors, setPopularVendors] = useState<Vendor[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const run = async () => {
      const [productsRes, vendorsRes] = await Promise.all([
        api.get<ApiResponse<Product[]>>("/products/featured/list"),
        api.get<ApiResponse<Vendor[]>>("/vendors"),
      ]);
      setFeaturedProducts(productsRes.data.data);
      setPopularVendors(vendorsRes.data.data.slice(0, 4));
    };
    void run();
  }, []);

  return (
    <div className="pb-6">
      <section className="container pt-14 md:pt-20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          transition={{ duration: 0.5 }}
          className="glass-card overflow-hidden rounded-[24px] p-8 md:p-12"
        >
          <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1 text-xs font-semibold text-emerald-700">
                <BadgeCheck size={14} /> Trusted by local shoppers
              </p>
              <h1 className="mt-5 text-4xl font-bold leading-tight text-slate-900 md:text-6xl">
                Shop Lucknow&apos;s
                <span className="text-gradient"> best local stores </span>
                in one place
              </h1>
              <p className="mt-4 max-w-2xl text-base text-slate-600 md:text-lg">
                Discover fresh groceries, handcrafted products, and neighborhood favorites with a premium marketplace experience.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link href="/products" className="btn-primary inline-flex items-center gap-2 px-6 py-3 text-sm">
                  Start Shopping
                  <ArrowRight size={16} />
                </Link>
                <Link href="/vendors" className="btn-secondary px-6 py-3 text-sm">
                  Explore Vendors
                </Link>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5">
              <p className="text-sm font-semibold text-slate-900">Find products instantly</p>
              <div className="mt-3 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2">
                <Search size={18} className="text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search atta, fruits, kurtas, spices..."
                  className="h-10 w-full bg-transparent text-sm outline-none"
                />
                <Link href={`/products?search=${encodeURIComponent(search)}`} className="btn-primary px-4 py-2 text-sm">
                  Search
                </Link>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {[
                  { icon: Truck, label: "Fast delivery" },
                  { icon: Store, label: "Local vendors" },
                  { icon: ShieldCheck, label: "Safe checkout" },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl bg-slate-50 p-3 text-center text-xs text-slate-600">
                    <item.icon size={16} className="mx-auto mb-2 text-emerald-600" />
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="section-soft mt-14 py-14">
        <div className="container">
          <h2 className="section-title">Popular Categories</h2>
          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {categories.map((category, idx) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link
                  href={`/products?category=${encodeURIComponent(category.name)}`}
                  className="glass-card block rounded-2xl p-4 text-center transition hover:-translate-y-1"
                >
                  <p className="text-2xl">{category.icon}</p>
                  <p className="mt-2 text-sm font-medium text-slate-700">{category.name}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-14">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="section-title">Featured Products</h2>
          <Link href="/products" className="text-sm font-semibold text-emerald-700 hover:text-emerald-800">
            View all
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      <section className="section-soft py-14">
        <div className="container">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="section-title">Popular Vendors</h2>
            <Link href="/vendors" className="text-sm font-semibold text-emerald-700 hover:text-emerald-800">
              View all
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {popularVendors.map((vendor) => (
              <VendorCard key={vendor._id} vendor={vendor} />
            ))}
          </div>
        </div>
      </section>

      <section className="container py-14">
        <h2 className="section-title">Why Choose Lucknow Cart</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            { title: "Local-first shopping", body: "Support trusted neighborhood stores and artisans." },
            { title: "Premium shopping experience", body: "Clean interface, secure flows, and simple checkout." },
            { title: "Curated quality products", body: "Fresh essentials and popular local favorites." },
          ].map((reason) => (
            <div key={reason.title} className="glass-card rounded-2xl p-6">
              <h3 className="font-semibold text-slate-900">{reason.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{reason.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-soft py-14">
        <div className="container">
          <h2 className="section-title">What Customers Say</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              "Ordering fresh groceries from nearby shops is effortless now.",
              "Love the UI and how easily I can find trusted local vendors.",
              "Checkout is smooth and the product quality has been excellent.",
            ].map((quote) => (
              <div key={quote} className="glass-card rounded-2xl p-6">
                <p className="text-sm leading-relaxed text-slate-600">“{quote}”</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-16">
        <div className="rounded-[24px] bg-gradient-to-r from-emerald-600 to-green-700 p-8 text-white shadow-xl md:p-10">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-2xl font-semibold">Ready to discover Lucknow&apos;s best local stores?</h3>
              <p className="mt-2 text-sm text-emerald-50">Start shopping and support local businesses today.</p>
            </div>
            <Link href="/products" className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-emerald-700">
              Browse Marketplace
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
