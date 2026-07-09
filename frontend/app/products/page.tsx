"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { SearchX } from "lucide-react";
import { ProductCard } from "../../components/ui/ProductCard";
import { api } from "../../lib/api";
import { ApiResponse, Product } from "../../types";

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const filters = useMemo(
    () => ({
      search: searchParams.get("search") || "",
      category: searchParams.get("category") || "",
    }),
    [searchParams]
  );

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await api.get<ApiResponse<Product[]>>("/products", { params: filters });
        setProducts(res.data.data);
      } finally {
        setLoading(false);
      }
    };
    void fetchProducts();
  }, [filters]);

  return (
    <div className="container py-12">
      <div className="glass-card rounded-3xl p-7">
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Marketplace</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">Discover Products</h1>
        <p className="mt-2 text-sm text-slate-600">
          Browse curated items from trusted vendors across Lucknow.
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {["Groceries", "Snacks", "Handmade", "Spices"].map((category) => (
          <Link
            key={category}
            href={`/products?category=${encodeURIComponent(category)}`}
            className="btn-secondary px-4 py-2 text-xs"
          >
            {category}
          </Link>
        ))}
      </div>

      {loading ? (
        <p className="mt-8 text-slate-600">Loading products...</p>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
      {!loading && products.length === 0 && (
        <div className="glass-card mt-8 rounded-2xl p-8 text-center">
          <SearchX className="mx-auto text-slate-400" />
          <p className="mt-3 text-slate-600">No products found for this search.</p>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container py-12">Loading...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
