"use client";

import { useEffect, useMemo, useState } from "react";
import type { ChecklistItem } from "@/data/trip-data";

const STORAGE_KEY = "canada-family-trip-prep";

type PrepChecklistProps = {
  items: ChecklistItem[];
};

export function PrepChecklist({ items }: PrepChecklistProps) {
  const [completed, setCompleted] = useState<Record<string, boolean>>(() => {
    if (typeof window === "undefined") {
      return {};
    }

    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return {};
    }

    try {
      return JSON.parse(stored) as Record<string, boolean>;
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
      return {};
    }
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
  }, [completed]);

  const completedCount = useMemo(
    () => items.filter((item) => completed[item.id]).length,
    [completed, items],
  );

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-sky-50 p-4 text-sm text-sky-950">
        <strong>{completedCount}</strong> of <strong>{items.length}</strong>{" "}
        prep items completed on this device.
      </div>
      <div className="space-y-3">
        {items.map((item) => {
          const isChecked = Boolean(completed[item.id]);

          return (
            <label
              key={item.id}
              className="flex cursor-pointer items-start gap-4 rounded-2xl border border-slate-200 p-4 transition hover:border-sky-300 hover:bg-slate-50"
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() =>
                  setCompleted((current) => ({
                    ...current,
                    [item.id]: !current[item.id],
                  }))
                }
                className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
              />
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-base font-semibold text-slate-950">
                    {item.title}
                  </span>
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                    {item.owner}
                  </span>
                  <span className="rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">
                    Due {item.due}
                  </span>
                </div>
                <p className="text-sm leading-6 text-slate-600">
                  {item.description}
                </p>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
