import { DocumentUploader } from "@/components/document-uploader";
import { ImmigrationQAList } from "@/components/immigration-qa";
import { SectionCard } from "@/components/section-card";
import { tripOverview, uploadSlots } from "@/data/trip-data";
import { getSharedDetails, getStorageInfo, listDocuments } from "@/lib/doc-store";

export const dynamic = "force-dynamic";

export default async function DocumentsPage() {
  const [documents, details, storage] = await Promise.all([
    listDocuments(),
    getSharedDetails(),
    Promise.resolve(getStorageInfo()),
  ]);

  return (
    <div className="space-y-8">
      <SectionCard
        title="여행 서류"
        eyebrow="Documents"
        description="서류는 누구나 볼 수 있습니다. 업로드·삭제·전화번호 수정은 가족 PIN이 필요합니다."
      >
        <DocumentUploader
          slots={uploadSlots}
          initialDocuments={documents}
          initialDetails={details}
          initialStorage={storage}
        />
      </SectionCard>
      <SectionCard title="숙소" eyebrow="Stay">
        <div className="rounded-xl border border-[#f0d4d2] bg-[#fffafa] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#94a3b8]">
            주소
          </p>
          <p className="mt-2 text-lg font-bold text-[#1f2937]">
            {tripOverview.stayAddress}
          </p>
          <p className="mt-2 text-sm text-[#64748b]">친구집 숙박</p>
        </div>
      </SectionCard>
      <SectionCard
        title="입국심사"
        eyebrow="Border Q&A"
        description="캐나다 입국심사에서 자주 나오는 질문과 간단한 답변입니다. 숙소는 친구집 기준으로 적어 두었습니다."
      >
        <ImmigrationQAList />
      </SectionCard>
    </div>
  );
}
