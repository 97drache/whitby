import Link from "next/link";

const navItems = [
  { href: "/", label: "홈" },
  { href: "/itinerary", label: "여정" },
  { href: "/documents", label: "서류" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-red-100/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-3 px-4 py-4 sm:px-6">
        <div>
          <p className="text-xs font-semibold tracking-[0.22em] text-red-600">
            FAMILY TRIP
          </p>
          <h1 className="text-2xl font-semibold text-slate-900">Canada Again</h1>
        </div>
        <nav className="flex flex-wrap gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full border border-red-100 bg-red-50 px-4 py-2 text-sm font-medium text-red-800 transition hover:bg-red-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
