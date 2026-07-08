import { DocumentUploader } from "@/components/document-uploader";
import { SectionCard } from "@/components/section-card";
import { documents, sharedTravelDetails, uploadSlots } from "@/data/trip-data";

const statusMap = {
  ready: "준비됨",
  todo: "준비 필요",
  check: "확인 필요",
};

export default function DocumentsPage() {
  return (
    <div className="space-y-6">
      <SectionCard
        title="여행 서류"
        eyebrow="서류"
        description="가족이 아는 PIN으로만 열립니다. 관리자가 한 번 올리면 가족 모두가 같은 eTA와 eTicket을 볼 수 있습니다."
      >
        <DocumentUploader slots={uploadSlots} />
      </SectionCard>

      <SectionCard
        title="함께 볼 여행 정보"
        eyebrow="빠른 확인"
        description="서류 페이지에서도 숙소와 현지 번호를 바로 볼 수 있습니다."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5">
            <p className="text-sm font-medium text-emerald-700">숙소 주소</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">
              {sharedTravelDetails.stayAddress}
            </p>
          </div>
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

      <SectionCard
        title="서류 요약"
        eyebrow="한눈에"
        description="어떤 서류가 어디에 있는지 빠르게 참고할 수 있습니다."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {documents.map((document) => (
            <article
              key={document.id}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
            >
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-semibold text-slate-950">
                  {document.title}
                </h3>
                <span className="rounded-full bg-white px-2 py-1 text-xs font-medium text-slate-600">
                  {document.category}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {document.description}
              </p>
              <dl className="mt-4 space-y-2 text-sm text-slate-700">
                <div>
                  <dt className="font-semibold">보관 위치</dt>
                  <dd>{document.holder}</dd>
                </div>
                <div>
                  <dt className="font-semibold">필요할 때</dt>
                  <dd>{document.whenNeeded}</dd>
                </div>
                <div>
                  <dt className="font-semibold">상태</dt>
                  <dd>{statusMap[document.status]}</dd>
                </div>
              </dl>
              <p className="mt-4 text-sm text-slate-500">
                {document.href
                  ? "외부 링크가 연결되어 있습니다."
                  : "이 항목은 페이지 내용으로 확인합니다."}
              </p>
            </article>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
