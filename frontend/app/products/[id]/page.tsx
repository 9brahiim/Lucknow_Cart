"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Minus, Plus, Star, Store } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "../../../context/AuthContext";
import { useCart } from "../../../context/CartContext";
import { api } from "../../../lib/api";
import { ApiResponse, Product } from "../../../types";

const fallbackImage = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200";

const pseudoRating = (value: string) => 4.1 + ((value.length % 8) / 20);

export default function ProductDetailsPage() {
  const params = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const run = async () => {
      try {
        const res = await api.get<ApiResponse<Product>>(`/products/${params.id}`);
        setProduct(res.data.data);
        const related = await api.get<ApiResponse<Product[]>>("/products", {
          params: { category: res.data.data.category },
        });
        setRelatedProducts(related.data.data.filter((item) => item._id !== res.data.data._id).slice(0, 4));
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, [params.id]);

  const handleAdd = async () => {
    if (!product) return;
    if (!user) {
      toast.error("Please login first");
      return;
    }
    await addToCart(product._id, quantity);
  };

  const rating = useMemo(() => (product ? pseudoRating(product.name).toFixed(1) : "4.6"), [product]);

  if (loading) return <div className="container py-12 text-slate-600">Loading product...</div>;
  if (!product) return <div className="container py-12 text-slate-600">Product not found.</div>;

  return (
    <div className="container py-12">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="space-y-6">
          <div className="glass-card overflow-hidden rounded-3xl p-3">
            <div className="relative h-[360px] w-full overflow-hidden rounded-2xl md:h-[500px]">
              <Image
                src={product.image || fallbackImage}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 700px"
              />
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-xl font-semibold">About this product</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{product.description}</p>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-xl font-semibold">Customer reviews</h2>
            <div className="mt-4 space-y-3">
              {[
                "Excellent quality and fresh delivery. Will order again!",
                "Packaging was clean and product matched description.",
              ].map((review) => (
                <div key={review} className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                  “{review}”
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:h-fit">
          <div className="glass-card rounded-3xl p-6">
            <p className="text-sm text-slate-500">{product.category}</p>
            <h1 className="mt-1 text-3xl font-bold text-slate-900">{product.name}</h1>
            <div className="mt-3 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                <Star size={12} className="fill-amber-400 text-amber-400" />
                {rating}
              </span>
              <span className="text-xs text-slate-500">127 reviews</span>
            </div>
            <p className="mt-5 text-3xl font-bold text-emerald-700">₹{product.price}</p>
            <p className="mt-1 text-sm text-slate-500">In stock: {product.stock}</p>

            <div className="mt-5 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="btn-secondary p-2"
                aria-label="Decrease quantity"
              >
                <Minus size={16} />
              </button>
              <span className="min-w-10 text-center text-lg font-semibold">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((prev) => Math.min(product.stock || 1, prev + 1))}
                className="btn-secondary p-2"
                aria-label="Increase quantity"
              >
                <Plus size={16} />
              </button>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              className="btn-primary mt-6 w-full px-5 py-3 text-sm"
              disabled={product.stock <= 0}
            >
              Add to Cart
            </button>

            <div className="mt-6 rounded-xl bg-slate-50 p-4">
              <p className="inline-flex items-center gap-2 text-sm font-medium text-slate-800">
                <Store size={16} className="text-emerald-600" />
                Vendor
              </p>
              <p className="mt-1 text-sm text-slate-600">{product.vendor?.shopName}</p>
            </div>
          </div>
        </aside>
      </div>

      <section className="mt-12">
        <h2 className="section-title">Related Products</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {relatedProducts.map((item) => (
            <div key={item._id} className="glass-card rounded-2xl p-3">
              <div className="relative h-36 w-full overflow-hidden rounded-xl">
                <Image src={item.image || fallbackImage} alt={item.name} fill className="object-cover" sizes="280px" />
              </div>
              <p className="mt-3 line-clamp-1 text-sm font-medium text-slate-900">{item.name}</p>
              <p className="text-sm font-semibold text-emerald-700">₹{item.price}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
