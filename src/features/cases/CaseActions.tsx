import axios from "axios";
import { useState } from "react";
import { caseApi as defaultApi } from "./api";
import type { CaseAction, CaseApi, CommandBase, LifecycleResponse } from "./types";

const labels: Record<CaseAction, string> = {
  START_REVIEW: "Start review",
  REQUEST_DOCUMENTS: "Request documents",
  REQUEST_PAYMENT: "Request payment",
  CANCEL_REQUIREMENT: "Cancel requirement",
  APPROVE: "Approve",
  REJECT: "Reject",
  ATTACH_DELIVERABLE: "Attach deliverable",
  COMPLETE: "Complete",
  CLOSE: "Close",
  POST_MESSAGE: "Post message",
};

const directActions = new Set<CaseAction>(["START_REVIEW", "APPROVE", "CLOSE"]);
const makeIdempotencyKey = () =>
  globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;

interface Props {
  lifecycle: LifecycleResponse;
  api?: CaseApi;
  onRefresh: () => Promise<void> | void;
}

export function CaseActions({ lifecycle, api = defaultApi, onRefresh }: Props) {
  const [selected, setSelected] = useState<CaseAction | null>(null);
  const [pending, setPending] = useState<CaseAction | null>(null);
  const [error, setError] = useState<string | null>(null);

  const run = async (action: CaseAction, fields: Record<string, FormDataEntryValue> = {}) => {
    const command: CommandBase = {
      expectedVersion: lifecycle.case.version,
      idempotencyKey: makeIdempotencyKey(),
    };
    setPending(action);
    setError(null);
    try {
      switch (action) {
        case "START_REVIEW": await api.startReview(lifecycle.case.id, command); break;
        case "APPROVE": await api.approve(lifecycle.case.id, command); break;
        case "CLOSE": await api.close(lifecycle.case.id, command); break;
        case "POST_MESSAGE": await api.postMessage(lifecycle.case.id, { ...command, message: String(fields.message) }); break;
        case "REJECT": await api.reject(lifecycle.case.id, { ...command, reason: String(fields.reason) }); break;
        case "REQUEST_DOCUMENTS": await api.requestDocuments(lifecycle.case.id, {
          ...command,
          title: String(fields.title),
          instructions: String(fields.instructions),
          documentLabels: String(fields.documentLabels).split(",").map((label) => label.trim()).filter(Boolean),
        }); break;
        case "REQUEST_PAYMENT": await api.requestPayment(lifecycle.case.id, {
          ...command,
          category: String(fields.category) as "INITIAL" | "OBJECTION" | "ADDITIONAL" | "CORRECTION",
          amountMinor: Math.round(Number(fields.amount) * 100),
          purpose: String(fields.purpose),
        }); break;
        case "CANCEL_REQUIREMENT": await api.cancelRequirement(
          lifecycle.case.id,
          String(fields.requirementId),
          { ...command, reason: String(fields.reason) },
        ); break;
        case "ATTACH_DELIVERABLE": await api.attachDeliverable(lifecycle.case.id, {
          ...command,
          assetId: (await api.uploadAsset(fields.file as File)).assetId,
          ...(fields.label ? { label: String(fields.label) } : {}),
        }); break;
        case "COMPLETE": {
          const completionSummary = String(fields.completionSummary || "").trim();
          const completionReference = String(fields.completionReference || "").trim();
          await api.complete(lifecycle.case.id, {
            ...command,
            ...(completionSummary && completionReference ? { completionSummary, completionReference } : {}),
          });
          break;
        }
      }
      setSelected(null);
      await onRefresh();
    } catch (caught) {
      if (axios.isAxiosError(caught) && caught.response?.status === 409) {
        setError("This request changed. Review the latest status and try again.");
        await onRefresh();
      } else {
        const message = axios.isAxiosError<{ error?: string; message?: string }>(caught)
          ? caught.response?.data?.error ?? caught.response?.data?.message
          : null;
        setError(message ?? "Unable to update this request. Please try again.");
      }
    } finally {
      setPending(null);
    }
  };

  const openRequirements = lifecycle.requirements.filter((requirement) => requirement.status === "OPEN");

  return (
    <section aria-label="Request actions" className="space-y-4">
      {error && <p role="alert" className="border border-red-300 bg-red-50 p-3 text-sm text-red-800">{error}</p>}
      <div className="flex flex-wrap gap-2">
        {lifecycle.availableActions.map((action) => (
          <button
            key={action}
            type="button"
            disabled={pending !== null}
            onClick={() => directActions.has(action) ? void run(action) : setSelected(action)}
            className="rounded-md bg-foreground px-4 py-2 text-sm font-semibold text-background disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pending === action ? "Submitting…" : labels[action]}
          </button>
        ))}
      </div>

      {selected && !directActions.has(selected) && (
        <form
          className="space-y-3 border border-border bg-card p-4"
          onSubmit={(event) => {
            event.preventDefault();
            void run(selected, Object.fromEntries(new FormData(event.currentTarget).entries()));
          }}
        >
          <h4 className="font-semibold text-foreground">{labels[selected]}</h4>
          {selected === "POST_MESSAGE" && <textarea required name="message" aria-label="Message" className="w-full border p-2" />}
          {selected === "REJECT" && <textarea required minLength={5} name="reason" aria-label="Rejection reason" className="w-full border p-2" />}
          {selected === "REQUEST_DOCUMENTS" && <>
            <input required name="title" aria-label="Requirement title" placeholder="Requirement title" className="w-full border p-2" />
            <textarea required name="instructions" aria-label="Document instructions" placeholder="Instructions" className="w-full border p-2" />
            <input required name="documentLabels" aria-label="Document labels" placeholder="PAN card, Address proof" className="w-full border p-2" />
          </>}
          {selected === "REQUEST_PAYMENT" && <>
            <select name="category" aria-label="Payment category" className="w-full border p-2" defaultValue="ADDITIONAL">
              <option value="INITIAL">Initial</option><option value="OBJECTION">Objection</option>
              <option value="ADDITIONAL">Additional</option><option value="CORRECTION">Correction</option>
            </select>
            <input required min="1" step="0.01" type="number" name="amount" aria-label="Payment amount" placeholder="Amount in rupees" className="w-full border p-2" />
            <input required name="purpose" aria-label="Payment purpose" placeholder="Purpose" className="w-full border p-2" />
          </>}
          {selected === "CANCEL_REQUIREMENT" && <>
            <select required name="requirementId" aria-label="Requirement" className="w-full border p-2">
              <option value="">Select requirement</option>
              {openRequirements.map((requirement) => <option key={requirement.id} value={requirement.id}>{requirement.title}</option>)}
            </select>
            <textarea required minLength={5} name="reason" aria-label="Cancellation reason" className="w-full border p-2" />
          </>}
          {selected === "ATTACH_DELIVERABLE" && <>
            <input required type="file" name="file" aria-label="Deliverable file" className="w-full border p-2" />
            <input name="label" aria-label="Deliverable label" placeholder="Deliverable label" className="w-full border p-2" />
          </>}
          {selected === "COMPLETE" && <>
            <textarea name="completionSummary" aria-label="Completion summary" placeholder="Optional completion summary" className="w-full border p-2" />
            <input name="completionReference" aria-label="Completion reference" placeholder="Optional completion reference" className="w-full border p-2" />
          </>}
          <div className="flex gap-2">
            <button disabled={pending !== null} type="submit" className="rounded-md bg-foreground px-4 py-2 text-sm font-semibold text-background disabled:opacity-50">
              {pending === selected ? "Submitting…" : "Submit"}
            </button>
            <button disabled={pending !== null} type="button" onClick={() => setSelected(null)} className="rounded-md border px-4 py-2 text-sm">Cancel</button>
          </div>
        </form>
      )}
    </section>
  );
}
