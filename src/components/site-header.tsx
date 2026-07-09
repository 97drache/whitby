import Link from "next/link";

const navItems = [
  { href: "/", label: "홈" },
  { href: "/itinerary", label: "여정" },
  { href: "/documents", label: "서류" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-[#f0d4d2] bg-white/95 text-[#1f2937] shadow-sm backdrop-blur">
      <div className="canada-stripe h-1.5 w-full" />
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="text-[11px] font-bold tracking-[0.28em] text-[#d52b1e]">
            ONTARIO FAMILY TRIP
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#1f2937] sm:text-3xl">
            Canada Again
          </h1>
        </div>
        <nav className="flex flex-wrap gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg border border-[#f0d4d2] bg-white px-4 py-2 text-sm font-bold text-[#d52b1e] shadow-sm transition hover:border-[#d52b1e] hover:bg-[#fff1f0]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
