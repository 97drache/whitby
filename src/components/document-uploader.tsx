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
          throw new Error("Unable to load shared documents.");
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
            : "Unable to load shared documents.",
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
        throw new Error("Unable to load shared documents.");
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
          : "Unable to load shared documents.",
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
      setError("Wrong family PIN. Try again.");
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
        throw new Error(payload?.error ?? "Upload failed.");
      }

      await checkSession();
    } catch (uploadError) {
      setError(
        uploadError instanceof Error ? uploadError.message : "Upload failed.",
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
        throw new Error("Unable to open file.");
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
        openError instanceof Error ? openError.message : "Unable to open file.",
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
        throw new Error("Unable to remove file.");
      }
      await checkSession();
    } catch (removeError) {
      setError(
        removeError instanceof Error
          ? removeError.message
          : "Unable to remove file.",
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
        throw new Error("Unable to clear shared files.");
      }
      await checkSession();
    } catch (clearError) {
      setError(
        clearError instanceof Error
          ? clearError.message
          : "Unable to clear shared files.",
      );
    } finally {
      setBusySlot(null);
    }
  }

  if (checking) {
    return (
      <div className="rounded-3xl bg-emerald-50 p-5 text-sm text-emerald-900">
        Checking family access...
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
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Family Lock
          </p>
          <h3 className="text-xl font-semibold text-slate-950">
            Enter family PIN to open documents
          </h3>
          <p className="text-sm leading-6 text-slate-600">
            Only family members with the shared PIN can view or upload eTA and
            eTicket files. Visitors without the PIN cannot see them.
          </p>
        </div>
        <input
          type="password"
          inputMode="numeric"
          autoComplete="one-time-code"
          value={pin}
          onChange={(event) => setPin(event.target.value)}
          placeholder="Family PIN"
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-base outline-none ring-emerald-300 focus:ring"
        />
        {error && <p className="text-sm text-rose-600">{error}</p>}
        <button
          type="submit"
          className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          Unlock documents
        </button>
      </form>
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-3xl bg-emerald-50 p-4 text-sm leading-6 text-emerald-950">
        <strong>{stats}</strong> shared with the family. Files stay behind the
        family PIN. After unlock, anyone in the family can open them on any
        device.
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-white p-4">
        <p className="text-sm leading-6 text-slate-600">
          Upload once here as the main administrator. Then every family member
          who knows the PIN can open the same documents.
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void handleLock()}
            className="rounded-full bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-300"
          >
            Lock again
          </button>
          <button
            type="button"
            onClick={() => void handleClearAll()}
            className="rounded-full bg-rose-100 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-200"
          >
            Clear all shared files
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
                  ? "Working..."
                  : document
                    ? "Replace shared file"
                    : "Upload shared file"}
              </label>
              {document ? (
                <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-900">
                    {document.name}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Uploaded {new Date(document.uploadedAt).toLocaleString()}
                  </p>
                  <div className="mt-3 flex gap-3">
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => void handleOpen(slot.id)}
                      className="rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:opacity-60"
                    >
                      Open file
                    </button>
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => void handleRemove(slot.id)}
                      className="rounded-full bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-300 disabled:opacity-60"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-sm text-slate-500">
                  No shared file uploaded yet.
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
        reject(new Error("Unable to read this file."));
        return;
      }
      resolve(reader.result);
    };
    reader.onerror = () => reject(new Error("Unable to read this file."));
    reader.readAsDataURL(file);
  });
}
