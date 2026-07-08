import { SectionCard } from "@/components/section-card";
import { itinerary } from "@/data/trip-data";

export default function ItineraryPage() {
  return (
    <div className="space-y-6">
      <SectionCard
        title="날짜별 여정"
        eyebrow="여정"
        description="출국과 귀국 일정을 가족이 함께 보기 쉽게 정리했습니다."
      >
        <div className="space-y-5">
          {itinerary.map((day) => (
            <article
              key={day.id}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold tracking-[0.12em] text-sky-700">
                    {day.date}
                  </p>
                  <h3 className="mt-1 text-2xl font-semibold text-slate-950">
                    {day.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">{day.summary}</p>
                </div>
                <div className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-700">
                  <p>
                    <strong>구간:</strong> {day.city}
                  </p>
                  <p className="mt-1">
                    <strong>숙소:</strong> {day.stay}
                  </p>
                </div>
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {day.legs.map((leg) => (
                  <div
                    key={`${day.id}-${leg.title}`}
                    className="rounded-2xl border border-slate-200 bg-white p-4"
                  >
                    <p className="text-sm font-medium text-sky-700">{leg.time}</p>
                    <p className="mt-1 font-semibold text-slate-950">{leg.title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {leg.description}
                    </p>
                    {leg.location && (
                      <p className="mt-2 text-sm text-slate-500">
                        위치: {leg.location}
                      </p>
                    )}
                    {leg.reference && (
                      <p className="mt-1 text-sm text-slate-500">
                        참고: {leg.reference}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
