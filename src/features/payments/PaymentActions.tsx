import { useState } from "react";
import { AdminRole, PaymentAttemptSummary } from "./types";

interface PaymentActionApi {
  reconcile(attemptId: string): Promise<void>;
  refund(attemptId: string, input: { reason: string }): Promise<void>;
}

export function PaymentActions({
  role,
  attempt,
  api,
  onChanged,
}: {
  role: AdminRole;
  attempt: PaymentAttemptSummary;
  api: PaymentActionApi;
  onChanged?: () => void;
}) {
  const [showRefund, setShowRefund] = useState(false);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (role !== "ADMIN") return null;
  const refundable = ["SUCCESS", "DUPLICATE_SUCCESS"].includes(attempt.status) && Boolean(attempt.gatewayPaymentId) && !attempt.refund;

  const reconcile = async () => {
    setBusy(true);
    setError(null);
    try {
      await api.reconcile(attempt.id);
      onChanged?.();
    } catch {
      setError("Reconciliation failed");
    } finally {
      setBusy(false);
    }
  };

  const refund = async () => {
    if (reason.trim().length < 5) {
      setError("Enter a clear refund reason");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await api.refund(attempt.id, { reason: reason.trim() });
      setShowRefund(false);
      onChanged?.();
    } catch {
      setError("Refund request failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button type="button" disabled={busy} onClick={reconcile}>Reconcile</button>
        {refundable ? <button type="button" disabled={busy} onClick={() => setShowRefund(true)}>Refund</button> : null}
      </div>
      {showRefund ? (
        <div className="space-y-2 rounded border border-red-200 p-3">
          <label className="block text-sm" htmlFor={`refund-reason-${attempt.id}`}>Refund reason</label>
          <textarea
            id={`refund-reason-${attempt.id}`}
            value={reason}
            onChange={(event) => setReason(event.target.value)}
          />
          <p className="text-sm text-red-700">This requests a full refund for the captured payment.</p>
          <button type="button" disabled={busy} onClick={refund}>Confirm full refund</button>
          <button type="button" disabled={busy} onClick={() => setShowRefund(false)}>Cancel</button>
        </div>
      ) : null}
      {error ? <p role="alert">{error}</p> : null}
    </div>
  );
}
