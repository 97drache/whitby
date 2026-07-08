import { DocumentUploader } from "@/components/document-uploader";
import { SectionCard } from "@/components/section-card";
import { sharedTravelDetails, uploadSlots } from "@/data/trip-data";

export default function DocumentsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <SectionCard
        title="여행 서류"
        eyebrow="서류"
        description="가족 PIN(0114)으로만 열립니다. 한 번 올리면 가족이 같은 서류를 볼 수 있습니다."
      >
        <DocumentUploader slots={uploadSlots} />
      </SectionCard>

      <SectionCard title="공유 정보" eyebrow="현지">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-red-100 bg-red-50 p-5">
            <p className="text-sm font-medium text-red-700">숙소</p>
            <p className="mt-2 text-base font-semibold text-slate-950">
              {sharedTravelDetails.stayAddress}
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-medium text-slate-600">렌터카</p>
            <p className="mt-2 text-base font-semibold text-slate-950">
              {sharedTravelDetails.rentalCarNumber}
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-medium text-slate-600">캐나다 번호</p>
            <p className="mt-2 text-base font-semibold text-slate-950">
              {sharedTravelDetails.canadaPhoneNumber}
            </p>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
