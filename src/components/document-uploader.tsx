"use client";

import { useEffect, useMemo, useState } from "react";
import type { UploadSlot } from "@/data/trip-data";

type UploadedDoc = {
  name: string;
  type: string;
  data: string;
};

type StoredDocs = Record<string, UploadedDoc | null>;

const DB_NAME = "canada-family-trip-docs";
const STORE_NAME = "local-files";
const DB_VERSION = 1;

type DocumentUploaderProps = {
  slots: UploadSlot[];
};

export function DocumentUploader({ slots }: DocumentUploaderProps) {
  const [docs, setDocs] = useState<StoredDocs>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadDocs = async () => {
      const db = await openDocsDb();
      const storedDocs = await readAllDocs(db);

      if (!cancelled) {
        setDocs(storedDocs);
        setIsLoaded(true);
      }
    };

    void loadDocs();

    return () => {
      cancelled = true;
    };
  }, []);

  const stats = useMemo(() => {
    const uploaded = slots.filter((slot) => docs[slot.id]).length;
    return `${uploaded}/${slots.length}`;
  }, [docs, slots]);

  const handleSelect = (slotId: string, file: File | null) => {
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const result = reader.result;

      if (typeof result !== "string") {
        return;
      }

      const nextDoc = {
        name: file.name,
        type: file.type || "application/octet-stream",
        data: result,
      };

      const db = await openDocsDb();
      await writeDoc(db, slotId, nextDoc);

      setDocs((current) => ({
        ...current,
        [slotId]: nextDoc,
      }));
    };

    reader.readAsDataURL(file);
  };

  const handleRemove = async (slotId: string) => {
    const db = await openDocsDb();
    await deleteDoc(db, slotId);

    setDocs((current) => ({
      ...current,
      [slotId]: null,
    }));
  };

  const handleClearAll = async () => {
    const db = await openDocsDb();
    await clearDocs(db);
    setDocs({});
  };

  return (
    <div className="space-y-5">
      <div className="rounded-3xl bg-emerald-50 p-4 text-sm leading-6 text-emerald-950">
        <strong>{stats}</strong> stored only in this browser on this device.
        These files are not uploaded to Vercel, not sent to a server, and not
        shared with other visitors.
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-white p-4">
        <p className="text-sm leading-6 text-slate-600">
          For extra privacy, use this page on a personal device and press
          `Clear all local files` after the trip if needed.
        </p>
        <button
          type="button"
          onClick={() => void handleClearAll()}
          className="rounded-full bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-300"
        >
          Clear all local files
        </button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {slots.map((slot) => {
          const document = docs[slot.id];

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
                  onChange={(event) =>
                    handleSelect(slot.id, event.target.files?.[0] ?? null)
                  }
                />
                {document ? "Replace file" : "Choose file"}
              </label>
              {!isLoaded && (
                <p className="mt-4 text-sm text-slate-500">
                  Loading local files saved in this browser...
                </p>
              )}
              {document ? (
                <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-900">
                    {document.name}
                  </p>
                  <div className="mt-3 flex gap-3">
                    <a
                      href={document.data}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
                    >
                      Open file
                    </a>
                    <button
                      type="button"
                      onClick={() => void handleRemove(slot.id)}
                      className="rounded-full bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-300"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-sm text-slate-500">
                  No file uploaded yet.
                </p>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}

function openDocsDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function readAllDocs(db: IDBDatabase): Promise<StoredDocs> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAllKeys();
    const result: StoredDocs = {};

    request.onsuccess = () => {
      const keys = request.result as string[];

      if (keys.length === 0) {
        resolve(result);
        return;
      }

      let completed = 0;

      keys.forEach((key) => {
        const docRequest = store.get(key);
        docRequest.onsuccess = () => {
          result[key] = (docRequest.result as UploadedDoc | undefined) ?? null;
          completed += 1;

          if (completed === keys.length) {
            resolve(result);
          }
        };
        docRequest.onerror = () => reject(docRequest.error);
      });
    };

    request.onerror = () => reject(request.error);
  });
}

function writeDoc(db: IDBDatabase, key: string, value: UploadedDoc): Promise<void> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(value, key);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

function deleteDoc(db: IDBDatabase, key: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(key);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

function clearDocs(db: IDBDatabase): Promise<void> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.clear();

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}
