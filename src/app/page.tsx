import Image from "next/image";
import Link from "next/link";
import type { FamilyMemberKey } from "@/data/trip-data";
import { itinerary, rentalCar, tripOverview } from "@/data/trip-data";
import { getSharedDetails } from "@/lib/doc-store";
import { toCanadaTelHref, toKoreanTelHref } from "@/lib/phone";

function PhoneLink({
  phone,
  href,
  fallback,
}: {
  phone: string;
  href: string | null;
  fallback?: string;
}) {
  if (!phone.trim()) {
    return <span className="text-[#94a3b8]">{fallback ?? "추후 입력"}</span>;
  }

  if (!href) {
    return <span>{phone}</span>;
  }

  return (
    <a
      href={href}
      className="font-medium text-[#1f2937] underline decoration-[#f0d4d2] underline-offset-2 transition hover:text-[#d52b1e] hover:decoration-[#d52b1e]"
    >
      {phone}
    </a>
  );
}

export default async function Home() {
  const start = itinerary[0];
  const end = itinerary[itinerary.length - 1];
  const sharedDetails = await getSharedDetails();

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-2xl border border-[#f0d4d2] bg-white shadow-lg">
        <div className="relative min-h-[360px] overflow-hidden sm:min-h-[440px]">
          <Image
            src="/images/banff-hero.jpg"
            alt="캐나다 밴프 모레인 호수와 로키 산맥 전경"
            fill
            priority
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 1024px"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/88 via-white/45 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-white/75 via-transparent to-transparent" />

          <div className="relative z-10 flex h-full min-h-[360px] flex-col justify-end px-6 py-8 sm:min-h-[440px] sm:px-10 sm:py-10">
            <div className="max-w-xl space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#f0d4d2] bg-white/90 px-3 py-1 text-xs font-bold tracking-[0.18em] text-[#d52b1e] shadow-sm">
                <span className="text-base">🍁</span>
                {tripOverview.destination}
              </div>
              <div>
                <h2 className="text-4xl font-bold tracking-tight text-[#1f2937] sm:text-5xl">
                  {tripOverview.title}
                </h2>
                <p className="mt-3 max-w-lg text-sm leading-7 text-[#475569] sm:text-base">
                  밴프의 설원에서 토론토의 가족 여정까지 — 출국, 숙박, 귀국 일정과
                  서류를 한곳에서 확인합니다.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 p-6 sm:grid-cols-2">
          <div className="rounded-xl border border-[#f0d4d2] bg-[#fffafa] p-5">
            <p className="text-[11px] font-bold tracking-[0.22em] text-[#d52b1e]">
              TRIP START
            </p>
            <p className="mt-3 text-2xl font-bold text-[#1f2937]">{start.date}</p>
            <p className="mt-1 text-sm text-[#64748b]">{start.title}</p>
            <p className="mt-4 text-sm font-medium text-[#334155]">
              ICN 09:35 → YYZ 09:55
            </p>
          </div>
          <div className="rounded-xl border border-[#f0d4d2] bg-[#fffafa] p-5">
            <p className="text-[11px] font-bold tracking-[0.22em] text-[#d52b1e]">
              TRIP END
            </p>
            <p className="mt-3 text-2xl font-bold text-[#1f2937]">{end.date}</p>
            <p className="mt-1 text-sm text-[#64748b]">{end.title}</p>
            <p className="mt-4 text-sm font-medium text-[#334155]">
              YYZ 12:55 → ICN 16:30 (+1)
            </p>
          </div>
        </div>

        <div className="grid gap-4 border-t border-[#f7e4e2] p-6 sm:grid-cols-2">
          <div className="rounded-xl border border-[#f0d4d2] bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#94a3b8]">
              Stay
            </p>
            <p className="mt-2 text-lg font-bold text-[#1f2937]">
              {tripOverview.stayAddress}
            </p>
          </div>
          <div className="rounded-xl border border-[#f0d4d2] bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#94a3b8]">
              Rental Car
            </p>
            <p className="mt-2 text-lg font-bold text-[#1f2937]">{rentalCar.model}</p>
            <p className="mt-2 text-sm text-[#64748b]">{rentalCar.details}</p>
            <p className="mt-2 text-sm text-[#334155]">
              7/20 10:00 픽업 · 8/13 반납
            </p>
          </div>
        </div>
        <div className="flex gap-3 border-t border-[#f7e4e2] px-6 pb-6">
          <Link href="/itinerary" className="btn-primary flex-1">
            여정 보기
          </Link>
          <Link href="/documents" className="btn-secondary flex-1">
            서류 열기
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {tripOverview.family.map((member) => {
          const canadaPhone =
            sharedDetails.phones[member.name.toLowerCase() as FamilyMemberKey];
          return (
            <div key={member.name} className="ticket-card rounded-xl p-5 pl-6">
              <p className="text-lg font-bold text-[#1f2937]">{member.name}</p>
              {member.note && (
                <p className="mt-2 text-sm text-[#64748b]">{member.note}</p>
              )}
              <div className="mt-4 space-y-2 text-sm">
                <p className="text-[#334155]">
                  <span className="font-semibold text-[#d52b1e]">한국폰</span>{" "}
                  <PhoneLink
                    phone={member.koreanPhone}
                    href={toKoreanTelHref(member.koreanPhone)}
                  />
                </p>
                <p className="text-[#334155]">
                  <span className="font-semibold text-[#d52b1e]">캐나다폰</span>{" "}
                  <PhoneLink
                    phone={canadaPhone ?? ""}
                    href={canadaPhone ? toCanadaTelHref(canadaPhone) : null}
                    fallback="추후 입력"
                  />
                </p>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
