import { FormEvent, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AdminMfaFlow } from "../components/auth/AdminMfaFlow";
import { AdminSession, useAuthState } from "../config/apiClient";

export default function Login() {
  const navigate = useNavigate();
  const authState = useAuthState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [session, setSession] = useState<AdminSession | null>(null);
  const [busy, setBusy] = useState(false);
  const mfaApi = useMemo(() => ({
    enrollMfa: authState.enrollMfa,
    confirmMfa: authState.confirmMfa,
    verifyMfa: authState.verifyMfa,
    skipMfa: authState.skipMfa,
  }), [authState.enrollMfa, authState.confirmMfa, authState.verifyMfa, authState.skipMfa]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    try {
      const nextSession = await authState.login(email, password);
      if (!['ADMIN', 'COADMIN'].includes(nextSession.user.role)) throw new Error("Administrative access required");
      if (nextSession.mfaVerified) {
        authState.acceptSession(nextSession);
        navigate("/dashboard");
      } else {
        setSession(nextSession);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Authentication failed");
    } finally {
      setBusy(false);
    }
  };

  const completeMfa = async () => {
    try {
      await authState.refreshSession();
      navigate("/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to complete sign in");
    }
  };

  return (
    <main className="min-h-screen grid place-items-center bg-slate-950 p-6">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl space-y-5">
        <h1 className="text-2xl font-bold text-slate-900">LegalDhara Admin</h1>
        {session ? (
          <AdminMfaFlow
            session={session}
            api={mfaApi}
            onComplete={completeMfa}
            allowDevelopmentSkip={import.meta.env.DEV && import.meta.env.VITE_ALLOW_ADMIN_MFA_SKIP === "true"}
          />
        ) : (
          <form onSubmit={submit} className="space-y-5">
            <label className="block text-sm font-medium text-slate-800">Email
              <input className="mt-2 w-full rounded-lg border p-3" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </label>
            <label className="block text-sm font-medium text-slate-800">Password
              <input className="mt-2 w-full rounded-lg border p-3" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
            </label>
            <button className="w-full rounded-lg bg-blue-700 p-3 font-semibold text-white disabled:opacity-50" disabled={busy}>
              {busy ? "Signing in…" : "Continue"}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
