import Link from "next/link";
import { SectionCard } from "@/components/section-card";
import { documentViewPath, itinerary } from "@/data/trip-data";

export default function ItineraryPage() {
  return (
    <div className="space-y-8">
      <SectionCard
        title="여행 여정"
        eyebrow="Itinerary"
        description="출국, 공항 호텔, 귀국까지 날짜 순으로 정리했습니다."
      >
        <div className="space-y-6">
          {itinerary.map((day, index) => (
            <article
              key={day.id}
              className="overflow-hidden rounded-xl border border-[#f0d4d2] bg-white shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#f7e4e2] bg-[#fffafa] px-5 py-4">
                <div>
                  <p className="text-xs font-bold tracking-[0.16em] text-[#d52b1e]">
                    DAY {String(index + 1).padStart(2, "0")}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-500">{day.date}</p>
                  <h3 className="mt-2 text-2xl font-bold text-[#1f2937]">{day.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{day.summary}</p>
                </div>
                <div className="min-w-[220px] rounded-lg border border-[#f0d4d2] bg-white px-4 py-3 text-sm text-[#475569]">
                  <p>
                    <span className="font-semibold text-[#1f2937]">구간</span> {day.city}
                  </p>
                  <p className="mt-2">
                    <span className="font-semibold text-[#1f2937]">숙소</span> {day.stay}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 p-5 md:grid-cols-2">
                {day.legs.map((leg) => (
                  <div
                    key={`${day.id}-${leg.title}`}
                    className="ticket-card rounded-lg p-4 pl-5"
                  >
                    <p className="text-sm font-bold text-[#d52b1e]">{leg.time}</p>
                    <p className="mt-1 text-lg font-bold text-[#1f2937]">{leg.title}</p>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{leg.description}</p>
                    {leg.location && (
                      <p className="mt-2 text-sm text-slate-500">위치: {leg.location}</p>
                    )}
                  </div>
                ))}
              </div>

              {day.ticketLinks && day.ticketLinks.length > 0 && (
                <div className="flex flex-wrap gap-2 border-t border-[#f7e4e2] px-5 py-4">
                  {day.ticketLinks.map((ticket) => (
                    <Link
                      key={`${day.id}-${ticket.label}`}
                      href={documentViewPath(ticket.slotIds)}
                      className="btn-primary"
                    >
                      {ticket.label}
                    </Link>
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
