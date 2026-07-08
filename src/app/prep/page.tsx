import { PrepChecklist } from "@/components/prep-checklist";
import { SectionCard } from "@/components/section-card";
import { checklist } from "@/data/trip-data";

export default function PrepPage() {
  return (
    <div className="space-y-6">
      <SectionCard
        title="Pre-departure checklist"
        eyebrow="Prep"
        description="Checklist progress is saved in this browser so your family can track what is done."
      >
        <PrepChecklist items={checklist} />
      </SectionCard>
    </div>
  );
}
