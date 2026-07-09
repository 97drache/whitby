import { DocumentViewer } from "@/components/document-viewer";
import { SectionCard } from "@/components/section-card";
import { uploadSlots } from "@/data/trip-data";

type DocumentViewPageProps = {
  searchParams: Promise<{ slots?: string }>;
};

const ALLOWED_SLOT_IDS = new Set(uploadSlots.map((slot) => slot.id));

export default async function DocumentViewPage({ searchParams }: DocumentViewPageProps) {
  const { slots: slotsParam } = await searchParams;
  const slotIds =
    slotsParam
      ?.split(",")
      .map((slotId) => slotId.trim())
      .filter((slotId) => ALLOWED_SLOT_IDS.has(slotId)) ?? [];

  return (
    <div className="space-y-8">
      <SectionCard title="서류 보기" eyebrow="Documents" description="여정에서 선택한 서류입니다.">
        {slotIds.length > 0 ? (
          <DocumentViewer slotIds={slotIds} />
        ) : (
          <p className="text-sm text-[#64748b]">표시할 서류가 지정되지 않았습니다.</p>
        )}
      </SectionCard>
    </div>
  );
}
