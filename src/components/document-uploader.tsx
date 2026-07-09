"use client";

import { FormEvent, useMemo, useState } from "react";
import type { SharedDetails, UploadSlot } from "@/data/trip-data";

type DocumentMeta = {
  slotId: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
};

type StorageInfo = {
  mode: "blob" | "local" | "ephemeral";
  persistent: boolean;
  message: string;
};

type DocumentUploaderProps = {
  slots: UploadSlot[];
};

const EMPTY_DETAILS: SharedDetails = {
  canadaPhoneNumber: "",
  carNumber: "",
};

const CATEGORY_LABELS: Record<UploadSlot["category"], string> = {
  eta: "eTA",
  eticket: "왕복 eTicket",
  hotel: "호텔 예약",
  car: "차량 예약",
};

const CATEGORY_ORDER: UploadSlot["category"][] = ["eta", "eticket", "hotel", "car"];

export function DocumentUploader({ slots }: DocumentUploaderProps) {
  const [unlocked, setUnlocked] = useState(false);
  const [checking, setChecking] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [docs, setDocs] = useState<Record<string, DocumentMeta | null>>({});
  const [details, setDetails] = useState<SharedDetails>(EMPTY_DETAILS);
  const [storage, setStorage] = useState<StorageInfo | null>(null);

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

  async function refreshAll() {
    setChecking(true);
    setError("");

    try {
      const storageResponse = await fetch("/api/storage-status");
      if (storageResponse.ok) {
        setStorage((await storageResponse.json()) as StorageInfo);
      }

      const docResponse = await fetch("/api/documents");
      if (docResponse.status === 401) {
        setUnlocked(false);
        setDocs({});
        setDetails(EMPTY_DETAILS);
        return;
      }
      if (!docResponse.ok) {
        throw new Error("공유 서류를 불러올 수 없습니다.");
      }

      const detailResponse = await fetch("/api/shared-details");
      if (!detailResponse.ok) {
        throw new Error("공유 정보를 불러올 수 없습니다.");
      }

      const docPayload = (await docResponse.json()) as {
        documents: DocumentMeta[];
        storage?: StorageInfo;
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
      setUnlocked(true);
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
    await refreshAll();
  }

  async function handleLock() {
    await fetch("/api/family-auth", { method: "DELETE" });
    setUnlocked(false);
    setDocs({});
    setDetails(EMPTY_DETAILS);
    setError("");
  }

  async function handleSelect(slotId: string, file: File | null) {
    if (!file) return;
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
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? "업로드에 실패했습니다.");
      }
      await refreshAll();
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
    setBusyKey(slotId);
    setError("");
    try {
      const response = await fetch(`/api/documents?slotId=${slotId}`, { method: "DELETE" });
      if (!response.ok) throw new Error("파일을 삭제할 수 없습니다.");
      await refreshAll();
    } catch (removeError) {
      setError(removeError instanceof Error ? removeError.message : "파일을 삭제할 수 없습니다.");
    } finally {
      setBusyKey(null);
    }
  }

  async function saveDetails(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusyKey("details");
    setError("");
    try {
      const response = await fetch("/api/shared-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(details),
      });
      if (!response.ok) throw new Error("공유 정보를 저장할 수 없습니다.");
      await refreshAll();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "공유 정보를 저장할 수 없습니다.");
    } finally {
      setBusyKey(null);
    }
  }

  if (!unlocked) {
    return (
      <form
        onSubmit={handleUnlock}
        className="space-y-4 rounded-xl border border-[#f0d4d2] bg-white p-6"
      >
        <div>
          <p className="text-[11px] font-bold tracking-[0.22em] text-[#d52b1e]">FAMILY PIN</p>
          <h3 className="mt-2 text-xl font-bold text-[#1f2937]">가족 PIN으로 서류 열기</h3>
        </div>
        <input
          type="password"
          inputMode="numeric"
          value={pin}
          onChange={(event) => setPin(event.target.value)}
          placeholder="가족 PIN"
          className="w-full rounded-lg border border-[#f0d4d2] px-4 py-3 outline-none ring-[#d52b1e]/30 focus:ring"
        />
        {error && <p className="text-sm text-rose-600">{error}</p>}
        <button
          type="submit"
          className="rounded-lg bg-[#d52b1e] px-5 py-3 text-sm font-bold text-white"
        >
          열기
        </button>
      </form>
    );
  }

  return (
    <div className="space-y-6">
      {checking && (
        <div className="rounded-xl bg-[#fff1f0] p-4 text-sm text-[#b82419]">불러오는 중...</div>
      )}

      {storage && !storage.persistent && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm leading-7 text-amber-900">
          <p className="font-bold">서류가 배포 후 사라질 수 있습니다</p>
          <p className="mt-1">{storage.message}</p>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#f0d4d2] bg-[#fffafa] p-4 text-sm text-[#64748b]">
        <span>현재 {stats}개 업로드됨</span>
        {storage?.persistent && <span>{storage.message}</span>}
        <button
          type="button"
          onClick={() => void handleLock()}
          className="btn-secondary"
        >
          다시 잠그기
        </button>
      </div>

      {error && <div className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{error}</div>}

      <form
        onSubmit={saveDetails}
        className="grid gap-4 rounded-xl border border-[#f0d4d2] bg-white p-5 md:grid-cols-2"
      >
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            캐나다 개인 전화번호
          </label>
          <input
            value={details.canadaPhoneNumber}
            onChange={(event) =>
              setDetails((current) => ({
                ...current,
                canadaPhoneNumber: event.target.value,
              }))
            }
            placeholder="전화번호 입력"
            className="w-full rounded-lg border border-[#f0d4d2] px-4 py-3 outline-none ring-[#d52b1e]/30 focus:ring"
          />
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
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={busyKey === "details"}
            className="btn-primary"
          >
            {busyKey === "details" ? "저장 중..." : "공유 정보 저장"}
          </button>
        </div>
      </form>

      {groupedSlots.map((group) => (
        <section key={group.category} className="space-y-4">
          <h3 className="text-lg font-bold text-[#1f2937]">{group.label}</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {group.slots.map((slot) => {
              const document = docs[slot.id];
              const isBusy = busyKey === slot.id;
              return (
                <article
                  key={slot.id}
                  className="ticket-card rounded-lg p-5 pl-6"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-base font-bold text-[#1f2937]">{slot.documentType}</h4>
                    <span className="rounded-full bg-[#fff1f0] px-3 py-1 text-xs font-semibold text-[#d52b1e]">
                      {slot.person}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{slot.description}</p>
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
                        <button
                          type="button"
                          onClick={() => void handleRemove(slot.id)}
                          className="rounded-lg border border-[#f0d4d2] bg-white px-4 py-2 text-sm font-semibold text-[#64748b]"
                        >
                          삭제
                        </button>
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
