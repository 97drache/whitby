import Link from "next/link";
import { itinerary, tripOverview } from "@/data/trip-data";

export default function Home() {
  const start = itinerary[0];
  const end = itinerary[itinerary.length - 1];

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-[#e3dccf] bg-white shadow-sm">
        <div className="bg-[radial-gradient(circle_at_top,rgba(214,228,214,0.7),transparent_35%),linear-gradient(180deg,#f7f2e8_0%,#f4eee3_100%)] px-5 py-8 sm:px-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-xs font-semibold tracking-[0.24em] text-[#6a7d61]">
                {tripOverview.destination}
              </p>
              <h2 className="text-4xl font-semibold tracking-tight text-slate-900">
                {tripOverview.title}
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-white/90 p-5 shadow-sm">
                <p className="text-xs font-semibold tracking-[0.18em] text-[#6a7d61]">TRIP START</p>
                <p className="mt-3 text-xl font-semibold text-slate-950">{start.date}</p>
                <p className="mt-1 text-sm text-slate-600">{start.title}</p>
                <p className="mt-3 text-sm text-slate-700">ICN 09:35 → YYZ 09:55</p>
              </div>
              <div className="rounded-3xl bg-white/90 p-5 shadow-sm">
                <p className="text-xs font-semibold tracking-[0.18em] text-[#6a7d61]">TRIP END</p>
                <p className="mt-3 text-xl font-semibold text-slate-950">{end.date}</p>
                <p className="mt-1 text-sm text-slate-600">{end.title}</p>
                <p className="mt-3 text-sm text-slate-700">YYZ 12:55 → ICN 16:30 (+1)</p>
              </div>
            </div>
          </div>
        </div>
        <div className="grid gap-4 px-5 py-5 sm:grid-cols-[1.2fr_0.8fr] sm:px-8">
          <div className="rounded-3xl border border-[#e3dccf] bg-[#fbf8f1] p-4">
            <p className="text-sm text-slate-500">숙소</p>
            <p className="mt-2 font-semibold text-slate-950">{tripOverview.stayAddress}</p>
          </div>
          <div className="flex gap-3">
            <Link href="/itinerary" className="flex-1 rounded-full bg-[#566f55] px-4 py-3 text-center text-sm font-semibold text-white">여정</Link>
            <Link href="/documents" className="flex-1 rounded-full border border-[#d6cebf] bg-white px-4 py-3 text-center text-sm font-semibold text-slate-700">서류</Link>
          </div>
        </div>
      </section>
    </div>
  );
}