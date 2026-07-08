import { SectionCard } from "@/components/section-card";
import { itinerary } from "@/data/trip-data";

export default function ItineraryPage() {
  return (
    <div className="space-y-6">
      <SectionCard
        title="Day-by-day itinerary"
        eyebrow="Itinerary"
        description="Keep reservations, transfers, and daily flow visible for the whole family."
      >
        <div className="space-y-5">
          {itinerary.map((day) => (
            <article
              key={day.id}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
                    {day.date}
                  </p>
                  <h3 className="mt-1 text-2xl font-semibold text-slate-950">
                    {day.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">{day.summary}</p>
                </div>
                <div className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-700">
                  <p>
                    <strong>City:</strong> {day.city}
                  </p>
                  <p className="mt-1">
                    <strong>Stay:</strong> {day.stay}
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
                        Location: {leg.location}
                      </p>
                    )}
                    {leg.reference && (
                      <p className="mt-1 text-sm text-slate-500">
                        Ref: {leg.reference}
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
