import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../Store";
import { secureApi } from "../../config/apiClient";
import axios from "axios";

interface PaymentErrorPayload { message?: string }

const rejectedPaymentRequest = (error: unknown): PaymentErrorPayload => {
  if (axios.isAxiosError(error)) return error.response?.data ?? { message: error.message };
  return { message: error instanceof Error ? error.message : "Payment request failed" };
};

// Fetch paginated payments
export const fetchAllPayments = createAsyncThunk(
  "payments/fetchAll",
  async (
    {
      page = 1,
      limit = 10,
      search = "",
      status = "",
    }: {
      page?: number;
      limit?: number;
      search?: string;
      status?: string; // SUCCESS, FAILED, PENDING
    },
    { rejectWithValue }
  ) => {
    try {
      const query = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        ...(search ? { search } : {}),
        ...(status ? { status } : {}), // optional filter
      });

      const res = await secureApi.get(`/api/v1/payments/admin?${query.toString()}`);

      return res.data;
    } catch (error: unknown) {
      return rejectWithValue(rejectedPaymentRequest(error));
    }
  }
);

// Fetch payment by ID
export const fetchPaymentById = createAsyncThunk(
  "payments/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await secureApi.get(`/api/v1/payments/admin/${id}`);
      return res.data;
    } catch (error: unknown) {
      return rejectWithValue(rejectedPaymentRequest(error));
    }
  }
);

// --------------------
// Slice
// --------------------


interface Pagination {
  page: number;
  limit: number;
  totalPages: number;
  totalRecords: number;
}

interface PaymentState {
  payments: unknown[];
  paymentDetails: unknown;
  success: boolean;
  pagination: Pagination
  loading: boolean;
  error: string | null;
}

const initialState: PaymentState = {
  payments: [],
  paymentDetails: null,
  success: false,
  pagination: {
    page: 1,
    limit: 10,
    totalPages: 0,
    totalRecords: 0,
  },
  loading: false,
  error: null,
};

const paymentSlice = createSlice({
  name: "payments",
  initialState,
  reducers: {
    clearPaymentDetails: (state) => {
      state.paymentDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔹 Fetch All Payments
      .addCase(fetchAllPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload.data || [];
        state.pagination = action.payload.pagination || {
          ...initialState.pagination,
          totalRecords: state.payments.length,
          totalPages: 1,
        };
      })
      .addCase(fetchAllPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as PaymentErrorPayload | undefined)?.message || "Failed to fetch payments";
      })

      // 🔹 Fetch Payment By ID
      .addCase(fetchPaymentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentById.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentDetails = action.payload.data;
      })
      .addCase(fetchPaymentById.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as PaymentErrorPayload | undefined)?.message || "Failed to fetch payment details";
      });
  },
});

export const { clearPaymentDetails } = paymentSlice.actions;
export const selectPayments = (state: RootState) => state.payment.payments;
export default paymentSlice.reducer;
