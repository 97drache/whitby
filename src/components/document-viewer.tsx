"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { uploadSlots } from "@/data/trip-data";

type LoadedDocument = {
  slotId: string;
  label: string;
  person: string;
  name: string;
  type: string;
  dataUrl: string;
};

type DocumentViewerProps = {
  slotIds: string[];
};

const slotMap = Object.fromEntries(
  uploadSlots.map((slot) => [
    slot.id,
    {
      documentType: slot.documentType,
      person: slot.person,
      description: slot.description,
    },
  ]),
);

function isImageType(type: string, name: string) {
  if (type.startsWith("image/")) return true;
  return /\.(png|jpe?g|webp|gif)$/i.test(name);
}

function isPdfType(type: string, name: string) {
  if (type === "application/pdf") return true;
  return /\.pdf$/i.test(name);
}

export function DocumentViewer({ slotIds }: DocumentViewerProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [documents, setDocuments] = useState<LoadedDocument[]>([]);
  const [missingSlotIds, setMissingSlotIds] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function loadDocuments() {
      setLoading(true);
      setError("");

      try {
        const loaded: LoadedDocument[] = [];
        const missing: string[] = [];

        for (const slotId of slotIds) {
          const response = await fetch(`/api/documents/${slotId}`);
          if (response.status === 404) {
            missing.push(slotId);
            continue;
          }
          if (!response.ok) {
            throw new Error("서류를 불러올 수 없습니다.");
          }

          const payload = (await response.json()) as {
            slotId: string;
            name: string;
            type: string;
            dataUrl: string;
          };
          const slot = slotMap[slotId];
          loaded.push({
            slotId,
            label: slot?.documentType ?? slotId,
            person: slot?.person ?? "",
            name: payload.name,
            type: payload.type,
            dataUrl: payload.dataUrl,
          });
        }

        if (!cancelled) {
          setDocuments(loaded);
          setMissingSlotIds(missing);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "불러오기에 실패했습니다.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadDocuments();
    return () => {
      cancelled = true;
    };
  }, [slotIds]);

  if (loading) {
    return (
      <div className="rounded-xl bg-[#fff1f0] p-4 text-sm text-[#b82419]">서류를 불러오는 중...</div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <Link href="/itinerary" className="btn-secondary">
          여정으로 돌아가기
        </Link>
        <Link href="/documents" className="btn-secondary">
          서류 전체 보기
        </Link>
      </div>

      {error && <div className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{error}</div>}

      {missingSlotIds.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <p className="font-semibold">아직 업로드되지 않은 서류가 있습니다.</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {missingSlotIds.map((slotId) => (
              <li key={slotId}>
                {slotMap[slotId]?.documentType ?? slotId}
                {slotMap[slotId]?.person ? ` (${slotMap[slotId].person})` : ""}
              </li>
            ))}
          </ul>
        </div>
      )}

      {documents.length === 0 && !error ? (
        <div className="rounded-xl border border-[#f0d4d2] bg-white p-6 text-sm text-[#64748b]">
          표시할 서류가 없습니다. 서류 메뉴에서 먼저 업로드해 주세요.
        </div>
      ) : (
        documents.map((document) => (
          <article
            key={document.slotId}
            className="overflow-hidden rounded-xl border border-[#f0d4d2] bg-white"
          >
            <div className="border-b border-[#f7e4e2] bg-[#fffafa] px-5 py-4">
              <p className="text-lg font-bold text-[#1f2937]">{document.label}</p>
              <p className="mt-1 text-sm text-[#64748b]">
                {document.person} · {document.name}
              </p>
              <a
                href={document.dataUrl}
                download={document.name}
                className="btn-primary mt-3 inline-flex"
              >
                다운로드
              </a>
            </div>
            <div className="bg-[#f8fafc] p-4">
              {isImageType(document.type, document.name) ? (
                // eslint-disable-next-line @next/next/no-img-element -- data URL preview from uploaded family documents
                <img
                  src={document.dataUrl}
                  alt={document.name}
                  className="mx-auto max-h-[70vh] w-full rounded-lg object-contain"
                />
              ) : isPdfType(document.type, document.name) ? (
                <iframe
                  src={document.dataUrl}
                  title={document.name}
                  className="h-[70vh] w-full rounded-lg border border-[#e2e8f0] bg-white"
                />
              ) : (
                <div className="rounded-lg bg-white p-6 text-center text-sm text-[#64748b]">
                  미리보기를 지원하지 않는 형식입니다. 다운로드 버튼을 이용해 주세요.
                </div>
              )}
            </div>
          </article>
        ))
      )}
    </div>
  );
}
