import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  dispatch: vi.fn(),
  fetchAllPayments: vi.fn((input) => ({ type: "payments/fetchAll", payload: input })),
}));

vi.mock("../hooks/hookType", () => ({ useAppDispatch: () => mocks.dispatch }));
vi.mock("react-redux", () => ({
  useSelector: (selector: (state: unknown) => unknown) => selector({
    payment: { payments: [], loading: false },
    auth: { role: "ADMIN" },
  }),
}));
vi.mock("../Store/PaymentSlice", () => ({ fetchAllPayments: mocks.fetchAllPayments }));
vi.mock("../features/payments/PaymentActions", () => ({ PaymentActions: () => null }));
vi.mock("../features/payments/api", () => ({ paymentAdminApi: {} }));

import PaymentPage from "./Payments";

describe("admin payment search", () => {
  beforeEach(() => vi.clearAllMocks());

  it("sends the search term to the API", () => {
    render(<PaymentPage />);
    fireEvent.change(screen.getByLabelText("Search payments"), { target: { value: "customer@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: "Search" }));

    expect(mocks.fetchAllPayments).toHaveBeenLastCalledWith({ limit: 100, search: "customer@example.com" });
  });
});
