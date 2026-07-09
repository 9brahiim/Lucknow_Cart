import Image from "next/image";
import { MapPin, Star } from "lucide-react";

import { Vendor } from "../../types";

const fallbackImage = "https://images.unsplash.com/photo-1514995669114-6081e934b693?w=900";

const pseudoRating = (shopName: string) => 4.2 + ((shopName.length % 10) / 20);

export const VendorCard = ({ vendor }: { vendor: Vendor }) => {
  return (
    <div className="group glass-card overflow-hidden rounded-[18px]">
      <div className="relative h-40 w-full overflow-hidden">
        <Image
          src={vendor.image || fallbackImage}
          alt={vendor.shopName}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 320px"
        />
      </div>
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-lg font-semibold text-slate-900">{vendor.shopName}</h3>
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">
            <Star size={12} className="fill-amber-400 text-amber-400" />
            {pseudoRating(vendor.shopName).toFixed(1)}
          </span>
        </div>
        <p className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
          {vendor.category}
        </p>
        <p className="flex items-start gap-2 text-sm text-slate-600">
          <MapPin size={16} className="mt-0.5 text-slate-400" />
          <span className="line-clamp-2">{vendor.address}</span>
        </p>
        <button type="button" className="btn-secondary w-full px-4 py-2 text-sm">
          View Shop
        </button>
      </div>
    </div>
  );
};
