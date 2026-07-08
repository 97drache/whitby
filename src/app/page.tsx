import Link from "next/link";
import { itinerary, sharedTravelDetails, tripOverview } from "@/data/trip-data";

export default function Home() {
  const start = itinerary[0];
  const end = itinerary[itinerary.length - 1];

  return (
    <div className="mx-auto w-full max-w-3xl space-y-5">
      <section className="overflow-hidden rounded-[2rem] border border-red-100 bg-white shadow-sm">
        <div className="relative overflow-hidden bg-[#ff0000] px-5 pb-8 pt-6 text-white sm:px-7">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_35%,rgba(255,255,255,0.95)_0_14%,transparent_15%)]" />
          <div className="absolute -right-10 top-6 h-40 w-40 rounded-full border-[18px] border-white/25" />
          <div className="relative space-y-4">
            <p className="text-xs font-semibold tracking-[0.24em] text-white/85">
              {tripOverview.destination}
            </p>
            <h2 className="text-4xl font-semibold tracking-tight">{tripOverview.title}</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl bg-white/15 p-4 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.16em] text-white/75">시작</p>
                <p className="mt-2 text-lg font-semibold">{start.date}</p>
                <p className="mt-1 text-sm text-white/90">{start.title}</p>
                <p className="mt-1 text-sm text-white/80">
                  ICN 09:35 → YYZ 09:55
                </p>
              </div>
              <div className="rounded-3xl bg-white/15 p-4 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.16em] text-white/75">끝</p>
                <p className="mt-2 text-lg font-semibold">{end.date}</p>
                <p className="mt-1 text-sm text-white/90">{end.title}</p>
                <p className="mt-1 text-sm text-white/80">
                  YYZ 12:55 → ICN 16:30 +1
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 px-5 py-5 sm:px-7">
          <div className="rounded-3xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">숙소</p>
            <p className="mt-1 text-lg font-semibold text-slate-950">
              {sharedTravelDetails.stayAddress}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 p-4">
              <p className="text-sm text-slate-500">먼저 출발</p>
              <p className="mt-1 font-semibold text-slate-950">Miyoung · Yiel</p>
            </div>
            <div className="rounded-3xl border border-slate-200 p-4">
              <p className="text-sm text-slate-500">나중 출발</p>
              <p className="mt-1 font-semibold text-slate-950">Yongwoon · Yireh</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              href="/itinerary"
              className="flex-1 rounded-full bg-red-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-red-700"
            >
              여정 보기
            </Link>
            <Link
              href="/documents"
              className="flex-1 rounded-full border border-red-200 bg-white px-4 py-3 text-center text-sm font-semibold text-red-700 transition hover:bg-red-50"
            >
              서류 열기
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
