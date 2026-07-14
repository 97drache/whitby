"use client";

import { useState } from "react";
import { immigrationQA, immigrationTips } from "@/data/immigration-qa";

export function ImmigrationQAList() {
  const [openId, setOpenId] = useState<string | null>(immigrationQA[0]?.id ?? null);

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-[#f0d4d2] bg-[#fffafa] p-4 text-sm leading-7 text-[#475569]">
        <p className="font-semibold text-[#1f2937]">입국심사 팁</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {immigrationTips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-[#94a3b8]">
          숙소: 친구집 · 1445 Coral Spgs Path, ON
        </p>
      </div>

      <div className="space-y-3">
        {immigrationQA.map((item, index) => {
          const isOpen = openId === item.id;
          return (
            <article
              key={item.id}
              className="overflow-hidden rounded-xl border border-[#f0d4d2] bg-white"
            >
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="flex w-full items-start gap-3 px-4 py-4 text-left"
                aria-expanded={isOpen}
              >
                <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#fff1f0] text-xs font-bold text-[#d52b1e]">
                  {index + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold text-[#1f2937]">
                    {item.questionKo}
                  </span>
                  <span className="mt-1 block text-xs text-[#94a3b8]">
                    {item.questionEn}
                  </span>
                </span>
                <span className="mt-1 text-xs font-semibold text-[#d52b1e]">
                  {isOpen ? "접기" : "답변"}
                </span>
              </button>

              {isOpen && (
                <div className="space-y-3 border-t border-[#f7e4e2] bg-[#fffafa] px-4 py-4">
                  <div>
                    <p className="text-[11px] font-bold tracking-[0.18em] text-[#d52b1e]">
                      한국어 답변
                    </p>
                    <p className="mt-1 text-sm leading-7 text-[#1f2937]">
                      {item.answerKo}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold tracking-[0.18em] text-[#d52b1e]">
                      English
                    </p>
                    <p className="mt-1 text-sm leading-7 text-[#334155]">
                      {item.answerEn}
                    </p>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
