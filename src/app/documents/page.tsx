import { DocumentUploader } from "@/components/document-uploader";
import { SectionCard } from "@/components/section-card";
import { documents, sharedTravelDetails, uploadSlots } from "@/data/trip-data";

const statusMap = {
  ready: "Ready",
  todo: "To collect",
  check: "Check details",
};

export default function DocumentsPage() {
  return (
    <div className="space-y-6">
      <SectionCard
        title="Travel documents"
        eyebrow="Documents"
        description="Simple local-only file slots for the 4 family eTA files and 4 family eTicket files."
      >
        <DocumentUploader slots={uploadSlots} />
      </SectionCard>

      <SectionCard
        title="Shared trip records"
        eyebrow="Quick Access"
        description="Keep the most useful family travel details visible on the same page."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5">
            <p className="text-sm font-medium text-emerald-700">Stay address</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">
              {sharedTravelDetails.stayAddress}
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-medium text-slate-600">Rental car number</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">
              {sharedTravelDetails.rentalCarNumber}
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-medium text-slate-600">Canadian SIM number</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">
              {sharedTravelDetails.canadaPhoneNumber}
            </p>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Document summary"
        eyebrow="At a Glance"
        description="Use these notes to keep track of which shared records are already prepared."
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
                  <dt className="font-semibold">Kept in</dt>
                  <dd>{document.holder}</dd>
                </div>
                <div>
                  <dt className="font-semibold">Needed when</dt>
                  <dd>{document.whenNeeded}</dd>
                </div>
                <div>
                  <dt className="font-semibold">Status</dt>
                  <dd>{statusMap[document.status]}</dd>
                </div>
              </dl>
              <p className="mt-4 text-sm text-slate-500">
                {document.href
                  ? "Shared link is available."
                  : "This item currently uses page content rather than an external link."}
              </p>
            </article>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
