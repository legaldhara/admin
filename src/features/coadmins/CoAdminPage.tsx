import { FormEvent, useCallback, useEffect, useState } from "react";
import { coAdminApi } from "./api";
import { CoAdminApi, CoAdminItem } from "./types";

export function CoAdminPage({ api = coAdminApi }: { api?: CoAdminApi }) {
  const [items, setItems] = useState<CoAdminItem[]>([]);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await api.list({ page: 1, limit: 20, ...(search.trim() && { search: search.trim() }) });
      setItems(result.data);
    } catch {
      setError("Unable to load co-admin accounts.");
    } finally {
      setLoading(false);
    }
  }, [api, search]);

  useEffect(() => { void load(); }, [load]);

  const invite = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api.invite({ fullName: fullName.trim(), email: email.trim().toLowerCase() });
      setFullName("");
      setEmail("");
      await load();
    } catch {
      setError("Unable to send the co-admin invitation.");
    } finally {
      setBusy(false);
    }
  };

  const setActive = async (item: CoAdminItem) => {
    const action = item.isActive ? "deactivate" : "activate";
    if (!window.confirm(`Are you sure you want to ${action} ${item.fullName}?`)) return;
    setBusy(true);
    try {
      await api.setActive(item.id, !item.isActive);
      await load();
    } catch {
      setError(`Unable to ${action} this account.`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl border bg-white p-5">
        <h2 className="text-lg font-semibold">Invite a co-admin</h2>
        <p className="mt-1 text-sm text-slate-500">They will receive a secure password-setup link and must enroll MFA.</p>
        <form onSubmit={invite} className="mt-4 grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
          <label className="text-sm font-medium">Full name
            <input className="mt-2 w-full rounded-lg border p-2.5" value={fullName} onChange={(event) => setFullName(event.target.value)} required minLength={2} />
          </label>
          <label className="text-sm font-medium">Email
            <input className="mt-2 w-full rounded-lg border p-2.5" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>
          <button className="rounded-lg bg-blue-950 px-5 py-2.5 font-semibold text-white disabled:opacity-50" disabled={busy}>Send invitation</button>
        </form>
      </section>

      <section className="rounded-xl border bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Co-admin accounts</h2>
          <label className="text-sm">Search
            <input className="ml-2 rounded-lg border p-2" value={search} onChange={(event) => setSearch(event.target.value)} />
          </label>
        </div>
        {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
        {loading ? <p className="mt-6 text-sm text-slate-500">Loading co-admins…</p> : items.length === 0 ? (
          <p className="mt-6 text-sm text-slate-500">No co-admins found.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead><tr className="border-b text-slate-500"><th className="p-3">Account</th><th className="p-3">Status</th><th className="p-3">MFA</th><th className="p-3">Invitation</th><th className="p-3">Actions</th></tr></thead>
              <tbody>{items.map((item) => (
                <tr key={item.id} className="border-b last:border-0">
                  <td className="p-3"><strong className="block">{item.fullName}</strong><span className="text-slate-500">{item.email}</span></td>
                  <td className="p-3">{item.isActive ? "Active" : "Inactive"}</td>
                  <td className="p-3">{item.mfaEnrolled ? "Enrolled" : "Not enrolled"}</td>
                  <td className="p-3">{item.adminInvitation?.deliveryStatus || "Unknown"}</td>
                  <td className="p-3 space-x-2">
                    {item.adminInvitation?.deliveryStatus === "FAILED" && <button className="text-blue-700" onClick={async () => { await api.resend(item.id); await load(); }}>Resend invitation</button>}
                    <button className={item.isActive ? "text-red-700" : "text-green-700"} disabled={busy} onClick={() => void setActive(item)}>{item.isActive ? "Deactivate" : "Activate"}</button>
                  </td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default CoAdminPage;
