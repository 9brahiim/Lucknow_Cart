"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { UserRole } from "../../types";

export const ProtectedRoute = ({
  children,
  role,
}: {
  children: React.ReactNode;
  role?: UserRole;
}) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/login");
      return;
    }
    if (role && user.role !== role) {
      router.push("/");
    }
  }, [loading, role, router, user]);

  if (loading || !user || (role && user.role !== role)) {
    return <div className="container py-12">Loading...</div>;
  }
  return <>{children}</>;
};
