import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { PaymentActions } from "./PaymentActions";

const successfulAttempt = {
  id: "attempt-1",
  status: "SUCCESS" as const,
  gatewayPaymentId: "pay-1",
  refund: null,
};

describe("PaymentActions", () => {
  it("hides refund and reconcile actions from COADMIN", () => {
    render(<PaymentActions role="COADMIN" attempt={successfulAttempt} api={{ refund: vi.fn(), reconcile: vi.fn() }} />);
    expect(screen.queryByRole("button", { name: /refund/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /reconcile/i })).not.toBeInTheDocument();
  });

  it("requires a reason and confirmation for a full refund", async () => {
    const user = userEvent.setup();
    const api = { refund: vi.fn(async () => undefined), reconcile: vi.fn(async () => undefined) };
    render(<PaymentActions role="ADMIN" attempt={successfulAttempt} api={api} />);

    await user.click(screen.getByRole("button", { name: "Refund" }));
    await user.type(screen.getByLabelText("Refund reason"), "Duplicate payment");
    await user.click(screen.getByRole("button", { name: "Confirm full refund" }));

    expect(api.refund).toHaveBeenCalledWith("attempt-1", { reason: "Duplicate payment" });
  });
});
