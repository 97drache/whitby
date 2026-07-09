"use client";

import { FormEvent, useMemo, useState } from "react";
import type { FamilyMemberKey, SharedDetails, UploadSlot } from "@/data/trip-data";
import { familyMembers } from "@/data/trip-data";
import type { StorageInfo } from "@/lib/doc-store";

type DocumentMeta = {
  slotId: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
};

type StorageInfoState = StorageInfo;

type DocumentUploaderProps = {
  slots: UploadSlot[];
  initialDocuments: DocumentMeta[];
  initialDetails: SharedDetails;
  initialStorage: StorageInfoState;
};

function buildDocsMap(slots: UploadSlot[], documents: DocumentMeta[]) {
  const nextDocs: Record<string, DocumentMeta | null> = {};
  for (const slot of slots) {
    nextDocs[slot.id] = documents.find((document) => document.slotId === slot.id) ?? null;
  }
  return nextDocs;
}

const CATEGORY_LABELS: Record<UploadSlot["category"], string> = {
  eta: "eTA",
  eticket: "왕복 eTicket",
  hotel: "호텔 예약",
  car: "차량 예약",
  parking: "주차 예약",
};

const CATEGORY_ORDER: UploadSlot["category"][] = [
  "eta",
  "eticket",
  "hotel",
  "car",
  "parking",
];

export function DocumentUploader({
  slots,
  initialDocuments,
  initialDetails,
  initialStorage,
}: DocumentUploaderProps) {
  const [canManage, setCanManage] = useState(false);
  const [checking, setChecking] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [docs, setDocs] = useState(() => buildDocsMap(slots, initialDocuments));
  const [details, setDetails] = useState(initialDetails);
  const [storage, setStorage] = useState<StorageInfoState | null>(initialStorage);

  const stats = useMemo(() => {
    const uploaded = slots.filter((slot) => docs[slot.id]).length;
    return `${uploaded}/${slots.length}`;
  }, [docs, slots]);

  const groupedSlots = useMemo(() => {
    return CATEGORY_ORDER.map((category) => ({
      category,
      label: CATEGORY_LABELS[category],
      slots: slots.filter((slot) => slot.category === category),
    })).filter((group) => group.slots.length > 0);
  }, [slots]);

  async function loadViewData() {
    setChecking(true);
    setError("");

    try {
      const storageResponse = await fetch("/api/storage-status");
      if (storageResponse.ok) {
        setStorage((await storageResponse.json()) as StorageInfoState);
      }

      const docResponse = await fetch("/api/documents");
      if (!docResponse.ok) {
        throw new Error("공유 서류를 불러올 수 없습니다.");
      }

      const detailResponse = await fetch("/api/shared-details");
      if (!detailResponse.ok) {
        throw new Error("공유 정보를 불러올 수 없습니다.");
      }

      const docPayload = (await docResponse.json()) as {
        documents: DocumentMeta[];
        storage?: StorageInfoState;
      };
      const detailPayload = (await detailResponse.json()) as { details: SharedDetails };
      const nextDocs: Record<string, DocumentMeta | null> = {};
      for (const slot of slots) {
        nextDocs[slot.id] =
          docPayload.documents.find((document) => document.slotId === slot.id) ?? null;
      }
      setDocs(nextDocs);
      setDetails(detailPayload.details);
      if (docPayload.storage) setStorage(docPayload.storage);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "불러오기에 실패했습니다.");
    } finally {
      setChecking(false);
    }
  }

  async function handleUnlock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const response = await fetch("/api/family-auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin }),
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      setError(payload?.error ?? "가족 PIN이 맞지 않습니다.");
      return;
    }

    setPin("");
    setCanManage(true);
    await loadViewData();
  }

  async function handleLock() {
    await fetch("/api/family-auth", { method: "DELETE" });
    setCanManage(false);
    setError("");
  }

  function requireManage(action: string) {
    setError(`업로드·삭제·수정은 가족 PIN으로 먼저 잠금 해제해 주세요. (${action})`);
  }

  async function handleSelect(slotId: string, file: File | null) {
    if (!file) return;
    if (!canManage) {
      requireManage("업로드");
      return;
    }

    setBusyKey(slotId);
    setError("");
    try {
      const dataUrl = await readFileAsDataUrl(file);
      const response = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slotId,
          name: file.name,
          type: file.type || "application/octet-stream",
          dataUrl,
        }),
      });
      if (response.status === 401) {
        setCanManage(false);
        throw new Error("PIN 인증이 만료되었습니다. 다시 잠금 해제해 주세요.");
      }
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? "업로드에 실패했습니다.");
      }
      await loadViewData();
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "업로드에 실패했습니다.");
    } finally {
      setBusyKey(null);
    }
  }

  async function handleOpen(slotId: string) {
    setBusyKey(slotId);
    setError("");
    try {
      const response = await fetch(`/api/documents/${slotId}`);
      if (!response.ok) throw new Error("파일을 열 수 없습니다.");
      const payload = (await response.json()) as { dataUrl: string; name: string };
      const link = document.createElement("a");
      link.href = payload.dataUrl;
      link.target = "_blank";
      link.rel = "noreferrer";
      link.download = payload.name;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (openError) {
      setError(openError instanceof Error ? openError.message : "파일을 열 수 없습니다.");
    } finally {
      setBusyKey(null);
    }
  }

  async function handleRemove(slotId: string) {
    if (!canManage) {
      requireManage("삭제");
      return;
    }

    setBusyKey(slotId);
    setError("");
    try {
      const response = await fetch(`/api/documents?slotId=${slotId}`, { method: "DELETE" });
      if (response.status === 401) {
        setCanManage(false);
        throw new Error("PIN 인증이 만료되었습니다. 다시 잠금 해제해 주세요.");
      }
      if (!response.ok) throw new Error("파일을 삭제할 수 없습니다.");
      await loadViewData();
    } catch (removeError) {
      setError(removeError instanceof Error ? removeError.message : "파일을 삭제할 수 없습니다.");
    } finally {
      setBusyKey(null);
    }
  }

  async function saveDetails(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canManage) {
      requireManage("정보 저장");
      return;
    }

    setBusyKey("details");
    setError("");
    try {
      const response = await fetch("/api/shared-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(details),
      });
      if (response.status === 401) {
        setCanManage(false);
        throw new Error("PIN 인증이 만료되었습니다. 다시 잠금 해제해 주세요.");
      }
      if (!response.ok) throw new Error("공유 정보를 저장할 수 없습니다.");
      await loadViewData();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "공유 정보를 저장할 수 없습니다.");
    } finally {
      setBusyKey(null);
    }
  }

  return (
    <div className="space-y-6">
      {checking && (
        <div className="rounded-xl bg-[#fff1f0] p-4 text-sm text-[#b82419]">새로고침 중...</div>
      )}

      {storage && !storage.persistent && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm leading-7 text-amber-900">
          <p className="font-bold">서류가 배포 후 사라질 수 있습니다</p>
          <p className="mt-1">{storage.message}</p>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#f0d4d2] bg-[#fffafa] p-4 text-sm text-[#64748b]">
        <span>현재 {stats}개 업로드됨 · 서류 보기는 PIN 없이 가능</span>
        {storage?.persistent && <span>{storage.message}</span>}
      </div>

      {error && <div className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{error}</div>}

      <section className="space-y-4 rounded-xl border border-[#f0d4d2] bg-white p-5">
        <div>
          <h3 className="text-base font-bold text-[#1f2937]">캐나다 개인 전화번호</h3>
          <p className="mt-1 text-sm text-[#64748b]">가족 4명 각각의 캐나다 번호입니다.</p>
        </div>
        {canManage ? (
          <form onSubmit={saveDetails} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {familyMembers.map((member) => {
                const key = member.toLowerCase() as FamilyMemberKey;
                return (
                  <div key={member}>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      {member}
                    </label>
                    <input
                      value={details.phones[key]}
                      onChange={(event) =>
                        setDetails((current) => ({
                          ...current,
                          phones: { ...current.phones, [key]: event.target.value },
                        }))
                      }
                      placeholder={`${member} 전화번호`}
                      className="w-full rounded-lg border border-[#f0d4d2] px-4 py-3 outline-none ring-[#d52b1e]/30 focus:ring"
                    />
                  </div>
                );
              })}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">차량 번호</label>
              <input
                value={details.carNumber}
                onChange={(event) =>
                  setDetails((current) => ({ ...current, carNumber: event.target.value }))
                }
                placeholder="차량 번호 입력"
                className="w-full rounded-lg border border-[#f0d4d2] px-4 py-3 outline-none ring-[#d52b1e]/30 focus:ring"
              />
            </div>
            <button type="submit" disabled={busyKey === "details"} className="btn-primary">
              {busyKey === "details" ? "저장 중..." : "공유 정보 저장"}
            </button>
          </form>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {familyMembers.map((member) => {
              const key = member.toLowerCase() as FamilyMemberKey;
              const phone = details.phones[key];
              return (
                <div
                  key={member}
                  className="rounded-lg border border-[#f0d4d2] bg-[#fffafa] px-4 py-3"
                >
                  <p className="text-xs font-semibold text-[#d52b1e]">{member}</p>
                  <p className="mt-1 text-sm font-medium text-[#1f2937]">
                    {phone || "아직 입력되지 않았습니다."}
                  </p>
                </div>
              );
            })}
            <div className="rounded-lg border border-[#f0d4d2] bg-[#fffafa] px-4 py-3 md:col-span-2">
              <p className="text-xs font-semibold text-[#d52b1e]">차량 번호</p>
              <p className="mt-1 text-sm font-medium text-[#1f2937]">
                {details.carNumber || "아직 입력되지 않았습니다."}
              </p>
            </div>
          </div>
        )}
      </section>

      {groupedSlots.map((group) => (
        <section key={group.category} className="space-y-4">
          <h3 className="text-lg font-bold text-[#1f2937]">{group.label}</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {group.slots.map((slot) => {
              const document = docs[slot.id];
              const isBusy = busyKey === slot.id;
              return (
                <article key={slot.id} className="ticket-card rounded-lg p-5 pl-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-base font-bold text-[#1f2937]">{slot.documentType}</h4>
                    <span className="rounded-full bg-[#fff1f0] px-3 py-1 text-xs font-semibold text-[#d52b1e]">
                      {slot.person}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{slot.description}</p>
                  {canManage && (
                    <label className="mt-4 flex cursor-pointer items-center justify-center rounded-lg border border-dashed border-[#f0d4d2] bg-[#fffafa] px-4 py-5 text-sm font-medium text-[#475569]">
                      <input
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg,.webp"
                        className="hidden"
                        disabled={isBusy}
                        onChange={(event) =>
                          void handleSelect(slot.id, event.target.files?.[0] ?? null)
                        }
                      />
                      {isBusy ? "처리 중..." : document ? "파일 바꾸기" : "파일 올리기"}
                    </label>
                  )}
                  {document ? (
                    <div className="mt-4 rounded-lg bg-[#fffafa] p-4">
                      <p className="text-sm font-semibold text-slate-900">{document.name}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        업로드 {new Date(document.uploadedAt).toLocaleString("ko-KR")}
                      </p>
                      <div className="mt-3 flex gap-3">
                        <button
                          type="button"
                          onClick={() => void handleOpen(slot.id)}
                          className="btn-primary"
                        >
                          열기
                        </button>
                        {canManage && (
                          <button
                            type="button"
                            onClick={() => void handleRemove(slot.id)}
                            className="rounded-lg border border-[#f0d4d2] bg-white px-4 py-2 text-sm font-semibold text-[#64748b]"
                          >
                            삭제
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="mt-4 text-sm text-slate-500">아직 업로드된 파일이 없습니다.</p>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      ))}

      {!canManage ? (
        <form
          onSubmit={handleUnlock}
          className="space-y-4 rounded-xl border border-[#f0d4d2] bg-white p-6"
        >
          <div>
            <p className="text-[11px] font-bold tracking-[0.22em] text-[#d52b1e]">FAMILY PIN</p>
            <h3 className="mt-2 text-xl font-bold text-[#1f2937]">업로드·수정하려면 PIN 입력</h3>
            <p className="mt-2 text-sm text-[#64748b]">
              서류 열기는 PIN 없이 됩니다. 업로드, 삭제, 전화번호 수정만 PIN이 필요합니다.
            </p>
          </div>
          <input
            type="password"
            inputMode="numeric"
            value={pin}
            onChange={(event) => setPin(event.target.value)}
            placeholder="가족 PIN"
            className="w-full rounded-lg border border-[#f0d4d2] px-4 py-3 outline-none ring-[#d52b1e]/30 focus:ring"
          />
          <button
            type="submit"
            className="rounded-lg bg-[#d52b1e] px-5 py-3 text-sm font-bold text-white"
          >
            업로드·수정 잠금 해제
          </button>
        </form>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#f0d4d2] bg-white p-4">
          <p className="text-sm font-semibold text-[#1f2937]">업로드·수정 모드가 켜져 있습니다.</p>
          <button type="button" onClick={() => void handleLock()} className="btn-secondary">
            수정 모드 끄기
          </button>
        </div>
      )}
    </div>
  );
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        reject(new Error("이 파일을 읽을 수 없습니다."));
        return;
      }
      resolve(reader.result);
    };
    reader.onerror = () => reject(new Error("이 파일을 읽을 수 없습니다."));
    reader.readAsDataURL(file);
  });
}
