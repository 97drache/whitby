import Link from "next/link";

const navItems = [
  { href: "/", label: "Overview" },
  { href: "/itinerary", label: "Itinerary" },
  { href: "/prep", label: "Prep" },
  { href: "/documents", label: "Documents" },
  { href: "/info", label: "Info" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-emerald-100/80 bg-white/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-emerald-600">
              Family Travel Hub
            </p>
            <h1 className="text-2xl font-semibold text-slate-900">
              Canada Trip Planner
            </h1>
          </div>
          <p className="max-w-xl text-sm text-slate-600">
            A warm, simple trip page for the whole family, with just the details
            everyone needs.
          </p>
        </div>
        <nav className="flex flex-wrap gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-900 transition hover:bg-emerald-200"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
