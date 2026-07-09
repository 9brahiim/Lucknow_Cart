export const Footer = () => {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white/80 backdrop-blur">
      <div className="container grid gap-10 py-14 md:grid-cols-3">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Lucknow Cart</h3>
          <p className="mt-3 text-sm text-slate-600">
            A premium local marketplace helping customers discover trusted vendors across Lucknow.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">Explore</p>
          <div className="mt-3 space-y-2 text-sm text-slate-600">
            <p>Products</p>
            <p>Vendors</p>
            <p>Order History</p>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">Support</p>
          <p className="mt-3 text-sm text-slate-600">Need help with orders? Reach us anytime.</p>
          <p className="mt-2 text-sm text-slate-600">support@lucknowcart.local</p>
        </div>
      </div>
      <div className="border-t border-slate-200 py-5 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Lucknow Cart. Built for local businesses with care.
      </div>
    </footer>
  );
};
