import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../Store/Store";
import { fetchAllPayments } from "../Store/PaymentSlice";
import { useAppDispatch } from "../hooks/hookType";
import { PaymentActions } from "../features/payments/PaymentActions";
import { paymentAdminApi } from "../features/payments/api";
import { AdminRole, PaymentAttemptSummary } from "../features/payments/types";

interface PaymentRow extends PaymentAttemptSummary {
  amountMinor: number;
  currency: string;
  gatewayOrderId: string | null;
  failureCode: string | null;
  failureDescription: string | null;
  createdAt: string;
  settledAt: string | null;
  charge: {
    id: string;
    userId: string;
    targetType: string;
    category: string;
    purpose: string;
    status: string;
  };
}

export default function PaymentPage() {
  const dispatch = useAppDispatch();
  const { payments, loading } = useSelector((state: RootState) => state.payment);
  const role = useSelector((state: RootState) => state.auth.role) as AdminRole;
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<PaymentRow | null>(null);

  const refresh = () => {
    void dispatch(fetchAllPayments({ limit: 100 }));
  };

  useEffect(refresh, [dispatch]);

  const rows = useMemo(() => (payments as PaymentRow[]).filter((attempt) => {
    const needle = search.trim().toLowerCase();
    if (!needle) return true;
    return [attempt.id, attempt.gatewayOrderId, attempt.gatewayPaymentId, attempt.charge.id, attempt.charge.purpose]
      .some((value) => value?.toLowerCase().includes(needle));
  }), [payments, search]);

  if (loading) return <div className="p-8">Loading payment records…</div>;

  return (
    <main className="space-y-5 p-4">
      <header>
        <h1 className="text-2xl font-semibold">Payment Recovery</h1>
        <p className="text-sm text-muted-foreground">Review Razorpay attempts, reconcile stale records, and request full refunds.</p>
      </header>
      <input
        aria-label="Search payments"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search order, payment, charge, or purpose"
        className="w-full max-w-xl rounded border p-2"
      />
      <div className="overflow-x-auto rounded border">
        <table className="w-full text-sm">
          <thead className="bg-foreground text-background">
            <tr>
              <th className="p-3 text-left">Attempt</th>
              <th className="p-3 text-left">Target</th>
              <th className="p-3 text-left">Charge / Attempt</th>
              <th className="p-3 text-right">Amount</th>
              <th className="p-3 text-left">Created</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((attempt) => (
              <tr key={attempt.id} className="border-t">
                <td className="p-3">
                  <button className="font-medium underline" onClick={() => setSelected(attempt)}>{attempt.id}</button>
                  <div className="text-xs text-muted-foreground">{attempt.gatewayOrderId || "Order not created"}</div>
                </td>
                <td className="p-3">{attempt.charge.targetType}<div className="text-xs">{attempt.charge.purpose}</div></td>
                <td className="p-3"><span>{attempt.charge.status}</span><span> / {attempt.status}</span></td>
                <td className="p-3 text-right">₹{(attempt.amountMinor / 100).toFixed(2)} {attempt.currency}</td>
                <td className="p-3">{new Date(attempt.createdAt).toLocaleString()}</td>
                <td className="p-3"><button onClick={() => setSelected(attempt)}>Review</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selected ? (
        <section className="space-y-3 rounded border bg-card p-5">
          <div className="flex justify-between gap-4">
            <div>
              <h2 className="font-semibold">Attempt {selected.id}</h2>
              <p className="text-sm">Payment ID: {selected.gatewayPaymentId || "Not captured"}</p>
              {selected.failureDescription ? <p className="text-sm text-red-700">{selected.failureCode}: {selected.failureDescription}</p> : null}
              {selected.refund ? <p className="text-sm">Refund: {selected.refund.status}</p> : null}
            </div>
            <button onClick={() => setSelected(null)}>Close</button>
          </div>
          <PaymentActions role={role} attempt={selected} api={paymentAdminApi} onChanged={refresh} />
        </section>
      ) : null}
    </main>
  );
}
