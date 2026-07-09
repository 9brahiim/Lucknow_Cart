"use client";

import { useEffect, useState } from "react";
import { VendorCard } from "../../components/ui/VendorCard";
import { api } from "../../lib/api";
import { ApiResponse, Vendor } from "../../types";

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await api.get<ApiResponse<Vendor[]>>("/vendors");
        setVendors(res.data.data);
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, []);

  return (
    <div className="container py-12">
      <div className="glass-card rounded-3xl p-7">
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Verified Partners</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">Local Vendors in Lucknow</h1>
        <p className="mt-2 text-sm text-slate-600">
          Discover shops offering quality products with trusted local service.
        </p>
      </div>
      {loading ? (
        <p className="mt-8 text-slate-600">Loading vendors...</p>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {vendors.map((vendor) => (
            <VendorCard key={vendor._id} vendor={vendor} />
          ))}
        </div>
      )}
    </div>
  );
}
