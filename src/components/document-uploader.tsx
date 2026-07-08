"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import type { UploadSlot } from "@/data/trip-data";

type DocumentMeta = {
  slotId: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
};

type DocumentUploaderProps = {
  slots: UploadSlot[];
};

export function DocumentUploader({ slots }: DocumentUploaderProps) {
  const [unlocked, setUnlocked] = useState(false);
  const [checking, setChecking] = useState(true);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [busySlot, setBusySlot] = useState<string | null>(null);
  const [docs, setDocs] = useState<Record<string, DocumentMeta | null>>({});

  const stats = useMemo(() => {
    const uploaded = slots.filter((slot) => docs[slot.id]).length;
    return `${uploaded}/${slots.length}`;
  }, [docs, slots]);

  useEffect(() => {
    let cancelled = false;

    async function checkSessionOnMount() {
      setChecking(true);
      setError("");

      try {
        const response = await fetch("/api/documents");
        if (cancelled) {
          return;
        }

        if (response.status === 401) {
          setUnlocked(false);
          setDocs({});
          return;
        }

        if (!response.ok) {
        throw new Error("공유 서류를 불러올 수 없습니다.");
      }

      const payload = (await response.json()) as { documents: DocumentMeta[] };
      const nextDocs: Record<string, DocumentMeta | null> = {};
      for (const slot of slots) {
        nextDocs[slot.id] =
          payload.documents.find((document) => document.slotId === slot.id) ??
          null;
      }
      setDocs(nextDocs);
      setUnlocked(true);
    } catch (loadError) {
      if (cancelled) {
        return;
      }

      setError(
        loadError instanceof Error
          ? loadError.message
          : "공유 서류를 불러올 수 없습니다.",
      );
        setUnlocked(false);
      } finally {
        if (!cancelled) {
          setChecking(false);
        }
      }
    }

    void checkSessionOnMount();

    return () => {
      cancelled = true;
    };
  }, [slots]);

  async function checkSession() {
    setChecking(true);
    setError("");

    try {
      const response = await fetch("/api/documents");
      if (response.status === 401) {
        setUnlocked(false);
        setDocs({});
        return;
      }

      if (!response.ok) {
        throw new Error("공유 서류를 불러올 수 없습니다.");
      }

      const payload = (await response.json()) as { documents: DocumentMeta[] };
      const nextDocs: Record<string, DocumentMeta | null> = {};
      for (const slot of slots) {
        nextDocs[slot.id] =
          payload.documents.find((document) => document.slotId === slot.id) ??
          null;
      }
      setDocs(nextDocs);
      setUnlocked(true);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "공유 서류를 불러올 수 없습니다.",
      );
      setUnlocked(false);
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
      setError("가족 PIN이 맞지 않습니다. 다시 입력해 주세요.");
      return;
    }

    setPin("");
    await checkSession();
  }

  async function handleLock() {
    await fetch("/api/family-auth", { method: "DELETE" });
    setUnlocked(false);
    setDocs({});
  }

  async function handleSelect(slotId: string, file: File | null) {
    if (!file) {
      return;
    }

    setBusySlot(slotId);
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
        const payload = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(payload?.error ?? "업로드에 실패했습니다.");
      }

      await checkSession();
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "업로드에 실패했습니다.",
      );
    } finally {
      setBusySlot(null);
    }
  }

  async function handleOpen(slotId: string) {
    setBusySlot(slotId);
    setError("");

    try {
      const response = await fetch(`/api/documents/${slotId}`);
      if (!response.ok) {
        throw new Error("파일을 열 수 없습니다.");
      }

      const payload = (await response.json()) as {
        dataUrl: string;
        name: string;
      };
      const link = window.document.createElement("a");
      link.href = payload.dataUrl;
      link.target = "_blank";
      link.rel = "noreferrer";
      link.download = payload.name;
      window.document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (openError) {
      setError(
        openError instanceof Error
          ? openError.message
          : "파일을 열 수 없습니다.",
      );
    } finally {
      setBusySlot(null);
    }
  }

  async function handleRemove(slotId: string) {
    setBusySlot(slotId);
    setError("");

    try {
      const response = await fetch(`/api/documents?slotId=${slotId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("파일을 삭제할 수 없습니다.");
      }
      await checkSession();
    } catch (removeError) {
      setError(
        removeError instanceof Error
          ? removeError.message
          : "파일을 삭제할 수 없습니다.",
      );
    } finally {
      setBusySlot(null);
    }
  }

  async function handleClearAll() {
    setBusySlot("all");
    setError("");

    try {
      const response = await fetch("/api/documents?all=1", { method: "DELETE" });
      if (!response.ok) {
        throw new Error("공유 서류를 모두 삭제할 수 없습니다.");
      }
      await checkSession();
    } catch (clearError) {
      setError(
        clearError instanceof Error
          ? clearError.message
          : "공유 서류를 모두 삭제할 수 없습니다.",
      );
    } finally {
      setBusySlot(null);
    }
  }

  if (checking) {
    return (
      <div className="rounded-3xl bg-emerald-50 p-5 text-sm text-emerald-900">
        가족 문서 접근 권한을 확인하는 중...
      </div>
    );
  }

  if (!unlocked) {
    return (
      <form
        onSubmit={handleUnlock}
        className="space-y-4 rounded-3xl border border-emerald-100 bg-white p-6"
      >
        <div className="space-y-2">
          <p className="text-xs font-semibold tracking-[0.18em] text-emerald-700">
            가족 잠금
          </p>
          <h3 className="text-xl font-semibold text-slate-950">
            가족 PIN을 입력해 서류를 열어주세요
          </h3>
          <p className="text-sm leading-6 text-slate-600">
            가족이 함께 아는 PIN으로만 eTA와 eTicket을 보고 올릴 수 있습니다.
            PIN을 모르는 방문자는 서류를 볼 수 없습니다.
          </p>
        </div>
        <input
          type="password"
          inputMode="numeric"
          autoComplete="one-time-code"
          value={pin}
          onChange={(event) => setPin(event.target.value)}
          placeholder="가족 PIN"
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-base outline-none ring-emerald-300 focus:ring"
        />
        {error && <p className="text-sm text-rose-600">{error}</p>}
        <button
          type="submit"
          className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          서류 열기
        </button>
      </form>
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-3xl bg-emerald-50 p-4 text-sm leading-6 text-emerald-950">
        현재 <strong>{stats}</strong>개를 가족이 함께 보고 있습니다. 서류는
        가족 PIN 뒤에 보관되며, 잠금을 풀면 어떤 기기에서도 같은 파일을 열 수
        있습니다.
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-white p-4">
        <p className="text-sm leading-6 text-slate-600">
          주 관리자가 여기서 한 번 올리면, PIN을 아는 가족 모두 같은 서류를 볼
          수 있습니다.
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void handleLock()}
            className="rounded-full bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-300"
          >
            다시 잠그기
          </button>
          <button
            type="button"
            onClick={() => void handleClearAll()}
            className="rounded-full bg-rose-100 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-200"
          >
            공유 서류 모두 삭제
          </button>
        </div>
      </div>
      {error && (
        <div className="rounded-3xl bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        {slots.map((slot) => {
          const document = docs[slot.id];
          const isBusy = busySlot === slot.id || busySlot === "all";

          return (
            <article
              key={slot.id}
              className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-semibold text-slate-900">
                  {slot.person}
                </h3>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  {slot.documentType}
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {slot.description}
              </p>
              <label className="mt-4 flex cursor-pointer items-center justify-center rounded-2xl border border-dashed border-emerald-300 bg-emerald-50 px-4 py-5 text-sm font-medium text-emerald-800 transition hover:bg-emerald-100">
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg,.webp"
                  className="hidden"
                  disabled={isBusy}
                  onChange={(event) =>
                    void handleSelect(slot.id, event.target.files?.[0] ?? null)
                  }
                />
                {isBusy
                  ? "처리 중..."
                  : document
                    ? "공유 파일 바꾸기"
                    : "공유 파일 올리기"}
              </label>
              {document ? (
                <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-900">
                    {document.name}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    업로드{" "}
                    {new Date(document.uploadedAt).toLocaleString("ko-KR")}
                  </p>
                  <div className="mt-3 flex gap-3">
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => void handleOpen(slot.id)}
                      className="rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:opacity-60"
                    >
                      파일 열기
                    </button>
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => void handleRemove(slot.id)}
                      className="rounded-full bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-300 disabled:opacity-60"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-sm text-slate-500">
                  아직 올린 공유 파일이 없습니다.
                </p>
              )}
            </article>
          );
        })}
      </div>
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
