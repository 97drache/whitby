import { SectionCard } from "@/components/section-card";
import { infoSections, sharedTravelDetails, tripOverview } from "@/data/trip-data";

export default function InfoPage() {
  return (
    <div className="space-y-6">
      <SectionCard
        title="누가 언제 출발하나요?"
        eyebrow="가족 이동 순서"
        description="부모님과 아이들이 바로 이해할 수 있도록 출발 순서를 간단히 적었습니다."
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
        title="현지에서 쓸 정보"
        eyebrow="정보"
        description="급할 때도 바로 찾을 수 있도록 핵심만 모아두었습니다."
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
        title="나중에 채울 정보"
        eyebrow="업데이트 포인트"
        description="캐나다 유심 번호나 렌터카 번호가 정해지면 여기서도 바로 확인할 수 있게 업데이트합니다."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-medium text-slate-600">렌터카 번호</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">
              {sharedTravelDetails.rentalCarNumber}
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-medium text-slate-600">캐나다 유심 번호</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">
              {sharedTravelDetails.canadaPhoneNumber}
            </p>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
