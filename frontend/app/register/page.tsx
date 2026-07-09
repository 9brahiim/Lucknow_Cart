"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { LockKeyhole, Mail, UserRound } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
}

export default function RegisterPage() {
  const { register, handleSubmit } = useForm<RegisterForm>();
  const { register: registerUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (values: RegisterForm) => {
    setLoading(true);
    try {
      await registerUser(values.name, values.email, values.password);
      router.push("/");
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
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Join Lucknow Cart</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Create your account</h1>
        <form className="mt-7 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <label className="block">
            <span className="mb-2 inline-block text-xs font-medium text-slate-600">Full Name</span>
            <div className="relative">
              <UserRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input {...register("name")} required placeholder="Your name" className="input-modern pl-10" />
            </div>
          </label>
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
          <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-sm disabled:opacity-60">
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>
        <p className="mt-5 text-sm text-slate-600">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-emerald-700">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
