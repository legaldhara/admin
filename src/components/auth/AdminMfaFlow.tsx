import { FormEvent, useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

export interface AdminMfaSession {
  mfaEnrolled: boolean;
  mfaVerified: boolean;
}

export interface AdminMfaApi {
  enrollMfa(): Promise<{ secret: string; otpauth: string }>;
  confirmMfa(code: string): Promise<{ recoveryCodes: string[] }>;
  verifyMfa(input: { code?: string; recoveryCode?: string }): Promise<void>;
  skipMfa(): Promise<void>;
}

interface Props {
  session: AdminMfaSession;
  api: AdminMfaApi;
  onComplete(): void;
  allowDevelopmentSkip?: boolean;
}

export function AdminMfaFlow({ session, api, onComplete, allowDevelopmentSkip = false }: Props) {
  const [enrollment, setEnrollment] = useState<{ secret: string; otpauth: string } | null>(null);
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    if (!session.mfaEnrolled) {
      api.enrollMfa()
        .then((value) => { if (active) setEnrollment(value); })
        .catch(() => { if (active) setError("Unable to start MFA enrollment."); });
    }
    return () => {
      active = false;
      setEnrollment(null);
      setRecoveryCodes([]);
      setCode("");
    };
  }, [api, session.mfaEnrolled]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (!session.mfaEnrolled) {
        const result = await api.confirmMfa(code);
        setRecoveryCodes(result.recoveryCodes);
      } else {
        await api.verifyMfa(/^\d{6}$/.test(code) ? { code } : { recoveryCode: code });
        onComplete();
      }
    } catch {
      setError("MFA verification failed. Check the code and try again.");
    } finally {
      setBusy(false);
    }
  };

  const skipForDevelopment = async () => {
    setBusy(true);
    setError("");
    try {
      await api.skipMfa();
      onComplete();
    } catch {
      setError("Unable to skip MFA. Confirm the local development flags are enabled.");
    } finally {
      setBusy(false);
    }
  };

  if (!session.mfaEnrolled && !enrollment) {
    return <p className="text-sm text-slate-600">{error || "Preparing secure MFA enrollment…"}</p>;
  }

  if (recoveryCodes.length > 0) {
    return (
      <section className="space-y-4" aria-labelledby="recovery-title">
        <h2 id="recovery-title" className="text-lg font-semibold text-slate-900">Save your recovery codes</h2>
        <p className="text-sm text-slate-600">Each code works once. Store them somewhere secure before continuing.</p>
        <ul className="grid grid-cols-2 gap-2 rounded-lg bg-slate-100 p-4 font-mono text-sm">
          {recoveryCodes.map((recoveryCode) => <li key={recoveryCode}>{recoveryCode}</li>)}
        </ul>
        <button type="button" className="w-full rounded-lg bg-blue-700 p-3 font-semibold text-white" onClick={() => {
          setRecoveryCodes([]);
          setEnrollment(null);
          onComplete();
        }}>I saved my recovery codes</button>
      </section>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {!session.mfaEnrolled && enrollment ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">Scan or enter this setup key</h2>
          <p className="text-sm leading-6 text-slate-600">
            Scan with an authenticator app, then enter the six-digit code below.
          </p>
          <div className="flex justify-center rounded-xl bg-white p-4 ring-1 ring-slate-200">
            <QRCodeSVG
              aria-label="Scan with your authenticator app"
              bgColor="#ffffff"
              fgColor="#0f172a"
              level="M"
              marginSize={2}
              role="img"
              size={184}
              value={enrollment.otpauth}
            />
          </div>
          <details className="rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700">
            <summary className="cursor-pointer font-medium">Enter setup key manually</summary>
            <p className="mt-2 break-all font-mono text-xs">{enrollment.secret}</p>
          </details>
        </section>
      ) : <p className="text-sm text-slate-600">Enter your authenticator code or one unused recovery code.</p>}
      <label className="block text-sm font-medium text-slate-800">
        {session.mfaEnrolled ? "Authenticator or recovery code" : "Authenticator code"}
        <input
          className="mt-2 w-full rounded-lg border p-3"
          value={code}
          onChange={(event) => setCode(event.target.value.trim())}
          autoComplete="one-time-code"
          required
        />
      </label>
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      <button className="w-full rounded-lg bg-blue-700 p-3 font-semibold text-white disabled:opacity-50" disabled={busy}>
        {busy ? "Verifying…" : session.mfaEnrolled ? "Verify MFA" : "Confirm MFA"}
      </button>
      {!session.mfaEnrolled && allowDevelopmentSkip && (
        <button
          className="w-full rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 underline decoration-slate-300 underline-offset-4 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50"
          disabled={busy}
          onClick={skipForDevelopment}
          type="button"
        >
          Set up later (local development only)
        </button>
      )}
    </form>
  );
}
