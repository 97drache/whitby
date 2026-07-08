import Link from "next/link";

const navItems = [
  { href: "/", label: "홈" },
  { href: "/itinerary", label: "여정" },
  { href: "/documents", label: "서류" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-[#e7dfcf] bg-[#f8f5ef]/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-3 px-4 py-4 sm:px-6">
        <div>
          <p className="text-xs font-semibold tracking-[0.22em] text-[#5d7a5d]">
            FAMILY TRIP HUB
          </p>
          <h1 className="text-2xl font-semibold text-slate-900">Canada Again</h1>
        </div>
        <nav className="flex flex-wrap gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full border border-[#dfd6c6] bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}