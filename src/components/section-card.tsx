import { ReactNode } from "react";

type SectionCardProps = {
  title: string;
  eyebrow?: string;
  description?: string;
  children: ReactNode;
};

export function SectionCard({
  title,
  eyebrow,
  description,
  children,
}: SectionCardProps) {
  return (
    <section className="ticket-card rounded-xl p-6 sm:p-7">
      {(eyebrow || description) && (
        <div className="mb-6 space-y-2 pl-3">
          {eyebrow && (
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#d52b1e]">
              {eyebrow}
            </p>
          )}
          <div>
            <h2 className="text-2xl font-bold text-[#1f2937]">{title}</h2>
            {description && (
              <p className="mt-2 text-sm leading-7 text-slate-600">
                {description}
              </p>
            )}
          </div>
        </div>
      )}
      {!eyebrow && !description && (
        <h2 className="mb-6 pl-3 text-2xl font-bold text-[#1f2937]">{title}</h2>
      )}
      <div className="pl-3">{children}</div>
    </section>
  );
}
