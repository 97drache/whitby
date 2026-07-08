import Link from "next/link";
import { SectionCard } from "@/components/section-card";
import {
  documents,
  itinerary,
  quickLinks,
  sharedTravelDetails,
  tripOverview,
} from "@/data/trip-data";

export default function Home() {
  const nextTripDay = itinerary[0];
  const readyDocuments = documents.filter((document) => document.status === "ready")
    .length;

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] bg-gradient-to-br from-emerald-100 via-sky-50 to-amber-50 px-6 py-8 text-slate-900 shadow-lg shadow-emerald-100/70 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-5">
            <p className="text-sm font-semibold tracking-[0.18em] text-emerald-700">
              {tripOverview.destination}
            </p>
            <div className="space-y-3">
              <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                {tripOverview.title}
              </h2>
              <p className="max-w-2xl text-base leading-7 text-slate-700 sm:text-lg">
                {tripOverview.subtitle}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/prep"
                className="rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
              >
                준비 체크리스트 보기
              </Link>
              <Link
                href="/documents"
                className="rounded-full border border-emerald-200 bg-white/70 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-white"
              >
                서류 확인하기
              </Link>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-3xl bg-white/80 p-5">
              <p className="text-sm text-slate-600">여행 구간</p>
              <p className="mt-2 text-lg font-semibold">
                {tripOverview.travelWindow}
              </p>
            </div>
            <div className="rounded-3xl bg-white/80 p-5">
              <p className="text-sm text-slate-600">다음 핵심 일정</p>
              <p className="mt-2 text-lg font-semibold">{nextTripDay.date}</p>
              <p className="text-sm text-slate-600">{nextTripDay.title}</p>
            </div>
            <div className="rounded-3xl bg-white/80 p-5">
              <p className="text-sm text-slate-600">준비된 서류</p>
              <p className="mt-2 text-lg font-semibold">
                {readyDocuments}/{documents.length}
              </p>
              <p className="text-sm text-slate-600">가족 서류를 쉽게 열어보세요</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
        <SectionCard
          title="가족 구성"
          eyebrow="여행 한눈에"
          description={tripOverview.countdownLabel}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              {tripOverview.family.map((member) => (
                <div
                  key={member.name}
                  className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4"
                >
                  <p className="font-semibold text-slate-950">{member.name}</p>
                  {member.departureGroup && (
                    <p className="mt-1 text-xs font-semibold tracking-[0.12em] text-emerald-700">
                      {member.departureGroup}
                    </p>
                  )}
                  {member.note && (
                    <p className="mt-1 text-sm text-slate-600">{member.note}</p>
                  )}
                </div>
              ))}
            </div>
            <div className="space-y-3">
              {tripOverview.highlights.map((highlight) => (
                <div
                  key={highlight}
                  className="rounded-2xl bg-amber-50 p-4 text-sm leading-6 text-amber-950"
                >
                  {highlight}
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="바로가기"
          eyebrow="자주 쓰는 링크"
          description="여행에 바로 필요한 사이트를 빠르게 열 수 있습니다."
        >
          <div className="space-y-3">
            {quickLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between rounded-2xl border border-emerald-100 p-4 text-sm font-medium text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50"
              >
                <span>{link.label}</span>
                <span className="text-emerald-700">열기</span>
              </a>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <SectionCard
          title="주요 여정"
          eyebrow="항공 일정"
          description="먼저 출발, 나중 출발, 귀국 일정을 간단히 확인할 수 있습니다."
        >
          <div className="space-y-4">
            {itinerary.map((day) => (
              <div
                key={day.id}
                className="rounded-2xl border border-slate-200 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-sky-700">{day.date}</p>
                    <p className="text-lg font-semibold text-slate-950">
                      {day.title}
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
                    {day.city}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {day.summary}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="가족이 공유할 정보"
          eyebrow="온타리오 베이스"
          description="여행 중에 모두가 자주 보게 될 핵심 정보입니다."
        >
          <div className="space-y-3">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
              <p className="text-sm font-medium text-emerald-700">숙소 주소</p>
              <p className="mt-1 text-lg font-semibold text-slate-950">
                {sharedTravelDetails.stayAddress}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm font-medium text-slate-600">렌터카 번호</p>
              <p className="mt-1 text-lg font-semibold text-slate-950">
                {sharedTravelDetails.rentalCarNumber}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm font-medium text-slate-600">캐나다 유심 번호</p>
              <p className="mt-1 text-lg font-semibold text-slate-950">
                {sharedTravelDetails.canadaPhoneNumber}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm font-medium text-slate-600">귀국 계획</p>
              <p className="mt-1 text-lg font-semibold text-slate-950">
                {sharedTravelDetails.returnPlan}
              </p>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
