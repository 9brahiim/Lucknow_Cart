"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { LayoutGrid, Search, ShoppingCart, Store, UserCircle2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

const navItems = [
  { href: "/products", label: "Categories", icon: LayoutGrid },
  { href: "/vendors", label: "Vendors", icon: Store },
];

export const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { items } = useCart();
  const [search, setSearch] = useState("");

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    router.push(`/products?search=${encodeURIComponent(search)}`);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/75 backdrop-blur-xl">
      <div className="container flex h-20 items-center gap-4">
        <Link href="/" className="min-w-fit">
          <motion.div whileHover={{ y: -1 }} className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-green-700 to-emerald-400 text-white shadow-lg shadow-emerald-200">
              LC
            </div>
            <div>
              <p className="text-base font-bold leading-none text-slate-900">Lucknow Cart</p>
              <p className="text-xs text-slate-500">Local Marketplace</p>
            </div>
          </motion.div>
        </Link>

        <form onSubmit={onSearch} className="glass-card hidden h-12 flex-1 items-center rounded-full px-3 md:flex">
          <Search size={18} className="text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for vegetables, snacks, spices..."
            className="h-full w-full bg-transparent px-3 text-sm outline-none"
            aria-label="Search products"
          />
          <button type="submit" className="btn-primary px-4 py-2 text-sm">
            Search
          </button>
        </form>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  active ? "bg-emerald-50 text-emerald-700" : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  <Icon size={16} />
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link href="/cart" className="btn-secondary px-3 py-2 text-sm">
            <span className="inline-flex items-center gap-2">
              <ShoppingCart size={16} />
              {items.length}
            </span>
          </Link>

          {user ? (
            <>
              <Link
                href={user.role === "admin" ? "/admin" : "/profile"}
                className="btn-secondary hidden px-4 py-2 text-sm sm:block"
              >
                {user.role === "admin" ? "Dashboard" : user.name.split(" ")[0]}
              </Link>
              <button type="button" onClick={logout} className="btn-primary px-4 py-2 text-sm">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-secondary px-4 py-2 text-sm">
                <span className="inline-flex items-center gap-2">
                  <UserCircle2 size={16} />
                  Login
                </span>
              </Link>
              <Link href="/register" className="btn-primary px-4 py-2 text-sm">
                Join
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
