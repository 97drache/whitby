import Link from "next/link";
import { SectionCard } from "@/components/section-card";
import { itinerary } from "@/data/trip-data";

export default function ItineraryPage() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <SectionCard title="여행 여정" eyebrow="Itinerary" description="날짜 기준으로 정리한 가족 일정입니다.">
        <div className="space-y-5">
          {itinerary.map((day) => (
            <article key={day.id} className="rounded-3xl border border-[#e3dccf] bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold tracking-[0.08em] text-[#6a7d61]">{day.date}</p>
                  <h3 className="mt-1 text-2xl font-semibold text-slate-950">{day.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{day.summary}</p>
                </div>
                <div className="rounded-2xl bg-[#fbf8f1] px-4 py-3 text-sm text-slate-700">
                  <p><strong>구간:</strong> {day.city}</p>
                  <p className="mt-1"><strong>숙소:</strong> {day.stay}</p>
                </div>
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {day.legs.map((leg) => (
                  <div key={`${day.id}-${leg.title}`} className="rounded-2xl border border-slate-200 bg-[#fbfaf7] p-4">
                    <p className="text-sm font-medium text-[#6a7d61]">{leg.time}</p>
                    <p className="mt-1 font-semibold text-slate-950">{leg.title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{leg.description}</p>
                    {leg.location && <p className="mt-2 text-sm text-slate-500">위치: {leg.location}</p>}
                  </div>
                ))}
              </div>
              {day.ticketLinks && day.ticketLinks.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {day.ticketLinks.map((ticket) => (
                    <Link key={`${day.id}-${ticket.label}`} href={ticket.href} className="rounded-full bg-[#566f55] px-4 py-2 text-sm font-semibold text-white">{ticket.label}</Link>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}