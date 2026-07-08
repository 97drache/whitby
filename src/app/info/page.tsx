import { SectionCard } from "@/components/section-card";
import { infoSections, sharedTravelDetails, tripOverview } from "@/data/trip-data";

export default function InfoPage() {
  return (
    <div className="space-y-6">
      <SectionCard
        title="Family travel flow"
        eyebrow="Who Leaves When"
        description="A simple summary so kids and adults can both understand the travel order."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {tripOverview.family.map((member) => (
            <article
              key={member.name}
              className="rounded-3xl border border-emerald-100 bg-emerald-50/60 p-5"
            >
              <p className="text-lg font-semibold text-slate-950">{member.name}</p>
              {member.departureGroup && (
                <p className="mt-2 text-sm font-semibold text-emerald-700">
                  {member.departureGroup}
                </p>
              )}
              {member.note && (
                <p className="mt-2 text-sm leading-6 text-slate-600">{member.note}</p>
              )}
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Travel info and family notes"
        eyebrow="Local Info"
        description="Keep practical details here so the essentials are available even under travel stress."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {infoSections.map((section) => (
            <article
              key={section.title}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
            >
              <h3 className="text-lg font-semibold text-slate-950">
                {section.title}
              </h3>
              <dl className="mt-4 space-y-3">
                {section.items.map((item) => (
                  <div key={`${section.title}-${item.label}`}>
                    <dt className="text-sm font-semibold text-slate-700">
                      {item.label}
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-slate-600">
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Editable details in code"
        eyebrow="Quick Update Points"
        description="When the Canadian SIM number or rental car number is confirmed, update these values in the trip data file."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-medium text-slate-600">Rental car number</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">
              {sharedTravelDetails.rentalCarNumber}
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-medium text-slate-600">Canadian SIM number</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">
              {sharedTravelDetails.canadaPhoneNumber}
            </p>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
