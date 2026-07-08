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
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
      {(eyebrow || description) && (
        <div className="mb-5 space-y-2">
          {eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
              {eyebrow}
            </p>
          )}
          <div>
            <h2 className="text-xl font-semibold text-slate-950">{title}</h2>
            {description && (
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {description}
              </p>
            )}
          </div>
        </div>
      )}
      {!eyebrow && !description && (
        <h2 className="mb-5 text-xl font-semibold text-slate-950">{title}</h2>
      )}
      {children}
    </section>
  );
}
