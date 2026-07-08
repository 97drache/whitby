import { DocumentUploader } from "@/components/document-uploader";
import { SectionCard } from "@/components/section-card";
import { tripOverview, uploadSlots } from "@/data/trip-data";

export default function DocumentsPage() {
  return (
    <div className="space-y-8">
      <SectionCard
        title="여행 서류"
        eyebrow="Documents"
        description="가족 PIN으로 열고, eTA·왕복 eTicket·호텔·차량 예약 서류를 관리합니다."
      >
        <DocumentUploader slots={uploadSlots} />
      </SectionCard>
      <SectionCard title="숙소" eyebrow="Stay">
        <div className="rounded-xl border border-[#d7e0ea] bg-[#f8fafc] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            주소
          </p>
          <p className="mt-2 text-lg font-bold text-[#0f1c2e]">
            {tripOverview.stayAddress}
          </p>
        </div>
      </SectionCard>
    </div>
  );
}
