"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { LockKeyhole, Mail } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface LoginForm {
  email: string;
  password: string;
  isAdmin: boolean;
}

export default function LoginPage() {
  const { register, handleSubmit } = useForm<LoginForm>();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (values: LoginForm) => {
    setLoading(true);
    try {
      await login(values.email, values.password, values.isAdmin);
      router.push(values.isAdmin ? "/admin" : "/");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-16">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-md rounded-[24px] border border-slate-200/80 bg-white/75 p-8 shadow-xl backdrop-blur-xl"
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Welcome back</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Login to your account</h1>
        <form className="mt-7 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <label className="block">
            <span className="mb-2 inline-block text-xs font-medium text-slate-600">Email</span>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input {...register("email")} type="email" required placeholder="you@example.com" className="input-modern pl-10" />
            </div>
          </label>
          <label className="block">
            <span className="mb-2 inline-block text-xs font-medium text-slate-600">Password</span>
            <div className="relative">
              <LockKeyhole size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input {...register("password")} type="password" required placeholder="••••••••" className="input-modern pl-10" />
            </div>
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input {...register("isAdmin")} type="checkbox" />
            Login as Admin
          </label>
          <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-sm disabled:opacity-60">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="mt-5 text-sm text-slate-600">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-emerald-700">
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
