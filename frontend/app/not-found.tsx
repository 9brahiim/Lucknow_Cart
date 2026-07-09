import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container py-20 text-center">
      <h1 className="text-5xl font-bold text-green-700">404</h1>
      <p className="mt-3 text-slate-600">Page not found.</p>
      <Link href="/" className="mt-6 inline-block rounded-full bg-green-700 px-6 py-3 text-white">
        Go Home
      </Link>
    </div>
  );
}
