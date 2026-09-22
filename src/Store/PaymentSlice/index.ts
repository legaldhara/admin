import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../Store";
import { secureApi } from "../../config/apiClient";

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

      const res = await secureApi.get(
        `/api/v1/payment/user/all?${query.toString()}`
      );

      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data || { message: err.message }
      );
    }
  }
);

// Fetch payment by ID
export const fetchPaymentById = createAsyncThunk(
  "payments/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await secureApi.get(`/api/v1/payment/${id}`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || { message: err.message });
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
  payments: any[];
  paymentDetails: any | null;
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
        state.payments = action.payload.payments || [];
        state.pagination = action.payload.pagination || initialState.pagination;
      })
      .addCase(fetchAllPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as any)?.message || "Failed to fetch payments";
      })

      // 🔹 Fetch Payment By ID
      .addCase(fetchPaymentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentById.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentDetails = action.payload.payment;
      })
      .addCase(fetchPaymentById.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as any)?.message || "Failed to fetch payment details";
      });
  },
});

export const { clearPaymentDetails } = paymentSlice.actions;
export const selectPayments = (state: RootState) => state.payment.payments;
export default paymentSlice.reducer;
