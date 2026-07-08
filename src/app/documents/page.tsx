import { DocumentUploader } from "@/components/document-uploader";
import { SectionCard } from "@/components/section-card";
import { tripOverview, uploadSlots } from "@/data/trip-data";

export default function DocumentsPage() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <SectionCard
        title="여행 서류"
        eyebrow="Documents"
        description="가족 PIN으로 열고, 출국/귀국 eTicket과 차량 예약 확인증을 함께 관리합니다."
      >
        <DocumentUploader slots={uploadSlots} />
      </SectionCard>
      <SectionCard title="숙소" eyebrow="Stay">
        <div className="rounded-3xl border border-[#e3dccf] bg-white p-5">
          <p className="text-sm text-slate-500">주소</p>
          <p className="mt-2 text-lg font-semibold text-slate-950">{tripOverview.stayAddress}</p>
        </div>
      </SectionCard>
    </div>
  );
}