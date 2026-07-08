import { PrepChecklist } from "@/components/prep-checklist";
import { SectionCard } from "@/components/section-card";
import { checklist } from "@/data/trip-data";

export default function PrepPage() {
  return (
    <div className="space-y-6">
      <SectionCard
        title="출국 전 체크리스트"
        eyebrow="준비"
        description="완료 상태는 이 브라우저에 저장되어, 같은 기기에서 이어서 확인할 수 있습니다."
      >
        <PrepChecklist items={checklist} />
      </SectionCard>
    </div>
  );
}
