import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AxiosError } from "axios";
import { describe, expect, it, vi } from "vitest";
import { CaseActions } from "./CaseActions";
import type { CaseApi, LifecycleResponse } from "./types";

vi.mock("./api", () => ({ caseApi: {} }));

const lifecycle = (overrides: Partial<LifecycleResponse> = {}): LifecycleResponse => ({
  case: {
    id: "11111111-1111-4111-8111-111111111111",
    type: "APPLICATION",
    status: "SUBMITTED",
    version: 3,
    submittedAt: "2026-10-06T00:00:00.000Z",
    approvedAt: null,
    rejectedAt: null,
    completedAt: null,
    closedAt: null,
  },
  timeline: [],
  requirements: [],
  deliverables: [],
  availableActions: ["START_REVIEW"],
  ...overrides,
});

const api = (): CaseApi => ({
  get: vi.fn(),
  uploadAsset: vi.fn(),
  startReview: vi.fn(async () => undefined),
  postMessage: vi.fn(),
  requestDocuments: vi.fn(),
  requestPayment: vi.fn(),
  cancelRequirement: vi.fn(),
  approve: vi.fn(),
  reject: vi.fn(),
  attachDeliverable: vi.fn(),
  complete: vi.fn(),
  close: vi.fn(),
});

describe("CaseActions", () => {
  it("renders only server-approved actions", () => {
    render(
      <CaseActions
        lifecycle={lifecycle({ availableActions: ["REQUEST_DOCUMENTS", "REJECT"] })}
        api={api()}
        onRefresh={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: /request documents/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /reject/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /complete/i })).not.toBeInTheDocument();
  });

  it("submits the current case version and one idempotency key", async () => {
    const user = userEvent.setup();
    const client = api();
    render(<CaseActions lifecycle={lifecycle()} api={client} onRefresh={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: /start review/i }));

    expect(client.startReview).toHaveBeenCalledWith(
      "11111111-1111-4111-8111-111111111111",
      expect.objectContaining({ expectedVersion: 3, idempotencyKey: expect.any(String) }),
    );
  });

  it("refreshes and explains version conflicts", async () => {
    const user = userEvent.setup();
    const client = api();
    const conflict = new AxiosError("Conflict", "ERR_BAD_RESPONSE", undefined, undefined, { status: 409 } as never);
    vi.mocked(client.startReview).mockRejectedValueOnce(conflict);
    const onRefresh = vi.fn(async () => undefined);
    render(<CaseActions lifecycle={lifecycle()} api={client} onRefresh={onRefresh} />);

    await user.click(screen.getByRole("button", { name: /start review/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "This request changed. Review the latest status and try again.",
    );
    expect(onRefresh).toHaveBeenCalledOnce();
  });
});
