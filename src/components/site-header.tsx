import Link from "next/link";

const navItems = [
  { href: "/", label: "홈" },
  { href: "/itinerary", label: "여정" },
  { href: "/documents", label: "서류" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-[#1a2d45] bg-[#0f1c2e] text-white shadow-lg">
      <div className="canada-stripe h-1 w-full" />
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.28em] text-[#f4b8b2]">
            ONTARIO FAMILY TRIP
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            Canada Again
          </h1>
        </div>
        <nav className="flex flex-wrap gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/10"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
