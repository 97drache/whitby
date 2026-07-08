import Link from "next/link";

const navItems = [
  { href: "/", label: "홈" },
  { href: "/itinerary", label: "여정" },
  { href: "/prep", label: "준비" },
  { href: "/documents", label: "서류" },
  { href: "/info", label: "정보" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-emerald-100/80 bg-white/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium tracking-[0.18em] text-emerald-600">
              가족 여행 허브
            </p>
            <h1 className="text-2xl font-semibold text-slate-900">
              캐나다 여행 플래너
            </h1>
          </div>
          <p className="max-w-xl text-sm text-slate-600">
            항공편, 서류, 숙소, 현지 번호를 한곳에 모아 가족이 함께 보는 밝은
            여행 페이지입니다.
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
