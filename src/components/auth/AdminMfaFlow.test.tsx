import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AdminMfaFlow } from "./AdminMfaFlow";

describe("AdminMfaFlow", () => {
  it("starts enrollment when MFA is not enrolled", async () => {
    const api = {
      enrollMfa: vi.fn().mockResolvedValue({ secret: "SETUPSECRET", otpauth: "otpauth://totp/LegalDhara" }),
      confirmMfa: vi.fn(),
      verifyMfa: vi.fn(),
      skipMfa: vi.fn(),
    };

    render(<AdminMfaFlow session={{ mfaEnrolled: false, mfaVerified: false }} api={api} onComplete={vi.fn()} />);

    expect(await screen.findByText(/scan or enter this setup key/i)).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /scan with your authenticator app/i })).toBeInTheDocument();
    expect(screen.getByText("SETUPSECRET")).toBeInTheDocument();
    expect(api.enrollMfa).toHaveBeenCalledOnce();
  });

  it("allows an explicitly enabled development-only MFA skip", async () => {
    const user = userEvent.setup();
    const api = {
      enrollMfa: vi.fn().mockResolvedValue({ secret: "SETUPSECRET", otpauth: "otpauth://totp/LegalDhara" }),
      confirmMfa: vi.fn(),
      verifyMfa: vi.fn(),
      skipMfa: vi.fn().mockResolvedValue(undefined),
    };
    const onComplete = vi.fn();

    render(<AdminMfaFlow session={{ mfaEnrolled: false, mfaVerified: false }} api={api} onComplete={onComplete} allowDevelopmentSkip />);
    await user.click(await screen.findByRole("button", { name: /set up later/i }));

    expect(api.skipMfa).toHaveBeenCalledOnce();
    expect(onComplete).toHaveBeenCalledOnce();
  });

  it("does not offer MFA skipping unless explicitly enabled", async () => {
    const api = {
      enrollMfa: vi.fn().mockResolvedValue({ secret: "SETUPSECRET", otpauth: "otpauth://totp/LegalDhara" }),
      confirmMfa: vi.fn(),
      verifyMfa: vi.fn(),
      skipMfa: vi.fn(),
    };

    render(<AdminMfaFlow session={{ mfaEnrolled: false, mfaVerified: false }} api={api} onComplete={vi.fn()} />);
    await screen.findByText(/scan or enter this setup key/i);

    expect(screen.queryByRole("button", { name: /set up later/i })).not.toBeInTheDocument();
  });

  it("shows recovery codes once after confirming enrollment", async () => {
    const user = userEvent.setup();
    const api = {
      enrollMfa: vi.fn().mockResolvedValue({ secret: "SETUPSECRET", otpauth: "otpauth://totp/LegalDhara" }),
      confirmMfa: vi.fn().mockResolvedValue({ recoveryCodes: ["recovery-one", "recovery-two"] }),
      verifyMfa: vi.fn(),
      skipMfa: vi.fn(),
    };
    const onComplete = vi.fn();

    render(<AdminMfaFlow session={{ mfaEnrolled: false, mfaVerified: false }} api={api} onComplete={onComplete} />);
    await user.type(await screen.findByLabelText(/authenticator code/i), "123456");
    await user.click(screen.getByRole("button", { name: /confirm mfa/i }));

    expect(await screen.findByText("recovery-one")).toBeInTheDocument();
    expect(localStorage.length).toBe(0);
    await user.click(screen.getByRole("button", { name: /i saved my recovery codes/i }));
    expect(onComplete).toHaveBeenCalledOnce();
  });

  it("verifies an enrolled administrator", async () => {
    const user = userEvent.setup();
    const api = {
      enrollMfa: vi.fn(),
      confirmMfa: vi.fn(),
      verifyMfa: vi.fn().mockResolvedValue(undefined),
      skipMfa: vi.fn(),
    };
    const onComplete = vi.fn();

    render(<AdminMfaFlow session={{ mfaEnrolled: true, mfaVerified: false }} api={api} onComplete={onComplete} />);
    await user.type(screen.getByLabelText(/authenticator or recovery code/i), "123456");
    await user.click(screen.getByRole("button", { name: /verify mfa/i }));

    await waitFor(() => expect(api.verifyMfa).toHaveBeenCalledWith({ code: "123456" }));
    expect(onComplete).toHaveBeenCalledOnce();
  });
});
