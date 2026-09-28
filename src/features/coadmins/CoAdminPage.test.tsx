import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("./api", () => ({ coAdminApi: {} }));
import { CoAdminPage } from "./CoAdminPage";

const emptyPage = { data: [], pagination: { page: 1, limit: 20, total: 0 } };

describe("CoAdminPage", () => {
  it("invites a co-admin and refreshes the list", async () => {
    const user = userEvent.setup();
    const api = {
      list: vi.fn().mockResolvedValue(emptyPage),
      invite: vi.fn().mockResolvedValue({ id: "coadmin-1", invitationStatus: "SENT" }),
      resend: vi.fn(),
      setActive: vi.fn(),
    };

    render(<CoAdminPage api={api} />);
    await screen.findByText(/no co-admins found/i);
    await user.type(screen.getByLabelText(/full name/i), "Operations Admin");
    await user.type(screen.getByLabelText(/email/i), "ops@example.com");
    await user.click(screen.getByRole("button", { name: /send invitation/i }));

    expect(api.invite).toHaveBeenCalledWith({ fullName: "Operations Admin", email: "ops@example.com" });
    await waitFor(() => expect(api.list).toHaveBeenCalledTimes(2));
  });

  it("requires confirmation before deactivating a co-admin", async () => {
    const user = userEvent.setup();
    const api = {
      list: vi.fn().mockResolvedValue({
        data: [{
          id: "coadmin-1", fullName: "Operations Admin", email: "ops@example.com", isActive: true,
          mfaEnrolled: true, createdAt: "2026-09-26T10:00:00.000Z", lastLogin: null,
          adminInvitation: { deliveryStatus: "SENT", lastSentAt: "2026-09-26T10:00:00.000Z", lastErrorAt: null },
        }],
        pagination: { page: 1, limit: 20, total: 1 },
      }),
      invite: vi.fn(),
      resend: vi.fn(),
      setActive: vi.fn().mockResolvedValue(undefined),
    };
    const confirm = vi.spyOn(window, "confirm").mockReturnValue(false);

    render(<CoAdminPage api={api} />);
    await user.click(await screen.findByRole("button", { name: /deactivate/i }));

    expect(confirm).toHaveBeenCalled();
    expect(api.setActive).not.toHaveBeenCalled();
    confirm.mockRestore();
  });
});
