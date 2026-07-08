import Link from "next/link";
import { itinerary, tripOverview } from "@/data/trip-data";

export default function Home() {
  const start = itinerary[0];
  const end = itinerary[itinerary.length - 1];

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-2xl border border-[#d7e0ea] bg-white shadow-xl">
        <div className="relative bg-[#0f1c2e] px-6 py-10 text-white sm:px-8">
          <div className="absolute inset-x-0 bottom-0 h-24 bg-[#1a3550] mountain-silhouette opacity-80" />
          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-[#f4b8b2]">
              <span className="text-base">🍁</span>
              {tripOverview.destination}
            </div>
            <div>
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
                {tripOverview.title}
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-slate-200">
                토론토에서의 가족 여정 — 출국, 숙박, 귀국 일정과 서류를 한곳에서
                확인합니다.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 p-6 sm:grid-cols-2">
          <div className="rounded-xl border border-[#d7e0ea] bg-[#f8fafc] p-5">
            <p className="text-[11px] font-bold tracking-[0.22em] text-[#d52b1e]">
              TRIP START
            </p>
            <p className="mt-3 text-2xl font-bold text-[#0f1c2e]">{start.date}</p>
            <p className="mt-1 text-sm text-slate-600">{start.title}</p>
            <p className="mt-4 text-sm font-medium text-slate-700">
              ICN 09:35 → YYZ 09:55
            </p>
          </div>
          <div className="rounded-xl border border-[#d7e0ea] bg-[#f8fafc] p-5">
            <p className="text-[11px] font-bold tracking-[0.22em] text-[#d52b1e]">
              TRIP END
            </p>
            <p className="mt-3 text-2xl font-bold text-[#0f1c2e]">{end.date}</p>
            <p className="mt-1 text-sm text-slate-600">{end.title}</p>
            <p className="mt-4 text-sm font-medium text-slate-700">
              YYZ 12:55 → ICN 16:30 (+1)
            </p>
          </div>
        </div>

        <div className="grid gap-4 border-t border-[#e6edf5] p-6 sm:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-xl border border-[#d7e0ea] bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Stay
            </p>
            <p className="mt-2 text-lg font-bold text-[#0f1c2e]">
              {tripOverview.stayAddress}
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/itinerary"
              className="flex flex-1 items-center justify-center rounded-lg bg-[#d52b1e] px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-[#b82419]"
            >
              여정 보기
            </Link>
            <Link
              href="/documents"
              className="flex flex-1 items-center justify-center rounded-lg border border-[#0f1c2e] bg-white px-4 py-3 text-center text-sm font-bold text-[#0f1c2e] transition hover:bg-[#f8fafc]"
            >
              서류 열기
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {tripOverview.family.map((member) => (
          <div
            key={member.name}
            className="ticket-card rounded-xl p-5 pl-6"
          >
            <p className="text-lg font-bold text-[#0f1c2e]">{member.name}</p>
            {member.note && (
              <p className="mt-2 text-sm text-slate-600">{member.note}</p>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}
