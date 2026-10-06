import type { CaseRequirement } from "./types";

export function CaseRequirements({ requirements }: { requirements: CaseRequirement[] }) {
  const open = requirements.filter((requirement) => requirement.status === "OPEN");
  if (open.length === 0) return <p className="text-sm text-muted-foreground">No open requirements.</p>;

  return (
    <div className="space-y-3">
      {open.map((requirement) => (
        <article key={requirement.id} className="border border-border bg-card p-4">
          <div className="flex items-center justify-between gap-3">
            <h4 className="font-semibold text-foreground">{requirement.title}</h4>
            <span className="text-xs font-semibold text-amber-700">{requirement.type}</span>
          </div>
          {requirement.instructions && <p className="mt-2 text-sm text-muted-foreground">{requirement.instructions}</p>}
          {requirement.documentLabels.length > 0 && (
            <p className="mt-2 text-xs text-muted-foreground">Documents: {requirement.documentLabels.join(", ")}</p>
          )}
          {requirement.payment && (
            <p className="mt-2 text-sm font-semibold text-foreground">
              {(requirement.payment.amountMinor / 100).toLocaleString("en-IN", {
                style: "currency",
                currency: requirement.payment.currency,
              })} — {requirement.payment.purpose}
            </p>
          )}
        </article>
      ))}
    </div>
  );
}
