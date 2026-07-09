"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, Star } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { Product } from "../../types";

const fallbackImage = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=900";

const pseudoRating = (name: string) => 4 + ((name.length % 10) / 20);

export const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const rating = pseudoRating(product.name).toFixed(1);

  const handleAdd = async () => {
    if (!user) {
      toast.error("Please login to add items");
      return;
    }
    await addToCart(product._id, 1);
  };

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="group glass-card overflow-hidden rounded-[18px]"
    >
      <Link href={`/products/${product._id}`} className="block overflow-hidden">
        <div className="relative h-44 w-full">
          <Image
            src={product.image || fallbackImage}
            alt={product.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 320px"
          />
          <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2 py-1 text-xs font-medium text-slate-700">
            {product.category}
          </span>
        </div>
      </Link>

      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="line-clamp-1 text-base font-semibold text-slate-900">{product.name}</h3>
            <p className="mt-1 line-clamp-1 text-xs text-slate-500">
              {product.vendor?.shopName || "Local vendor"}
            </p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">
            <Star size={12} className="fill-amber-400 text-amber-400" />
            {rating}
          </span>
        </div>

        <p className="line-clamp-2 text-sm text-slate-600">{product.description}</p>

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-emerald-700">₹{product.price}</span>
          <span className="text-xs text-slate-500">{product.stock > 0 ? "In stock" : "Out of stock"}</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Link href={`/products/${product._id}`} className="btn-secondary px-3 py-2 text-center text-sm">
            View
          </Link>
          <button
            type="button"
            onClick={handleAdd}
            disabled={product.stock <= 0}
            className="btn-primary inline-flex items-center justify-center gap-2 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ShoppingBag size={15} />
            Add
          </button>
        </div>
      </div>
    </motion.article>
  );
};
