// src/redux/slices/certificateAdminSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { secureApi } from "../../config/apiClient";

export interface Pagination {
  page: number;
  limit: number;
  totalPages: number;
  totalCount: number;
}


export interface CertificateRequest {
  id: string;
  status: "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "COMPLETED" | "CLOSED";
  createdAt: string;
  user?: Record<string, any>;
  updates?: Record<string, any>[];
}

export interface CertificateAdminState {
  requests: CertificateRequest[];
  loading: boolean;
  error: string | null | any;
  success: boolean;
  pagination: Pagination;
}


// Define the data structure (optional but recommended)
// export interface CertificateDetailsResponse {
//   success: boolean;
//   message: string;
//   data: {
//     requestNo: string;
//     subject: string;
//     description: string;
//     status: string;
//     docRequired: boolean;
//     pendingPayment: boolean;
//     isResolved: boolean;
//     createdAt: string;
//     resolvedAt: string | null;
//     totalPaid: number;
//     paymentCount: number;
//     latestUpdate: {
//       chargesRequired: string;
//       message: string;
//       transactionId: string | null;
//       attachmentUrl: string | null;
//       attachmentPublicId: string | null;
//       updateType: string;
//       createdAt: string;
//       updater: {
//         fullName: string;
//         role: string;
//       };
//     };
//     userDetails: {
//       fullName: string;
//       email: string;
//       phone: string;
//     };
//     paymentHistory: Array<{
//       amount: string;
//       status: string;
//       purpose: string;
//       paymentType: string;
//       transactionId: string;
//       paymentMethod: string;
//       paymentDate: string;
//     }>;
//     updateHistory: Array<{
//       chargesRequired: string | null;
//       message: string;
//       transactionId: string | null;
//       attachmentUrl: string | null;
//       attachmentPublicId: string | null;
//       updateType: string;
//       createdAt: string;
//       updater: {
//         fullName: string;
//         role: string;
//       };
//     }>;
//   };
// }

// export const fetchCertificateDetailsById = createAsyncThunk<
//   CertificateDetailsResponse, // Return type
//   string,                     // Argument type (requestNo)
//   { rejectValue: { message: string } }
// >(
//   "certificate/fetchById",
//   async (requestNo, { rejectWithValue }) => {
//     try {
//       const res = await secureApi.get(`/api/v1/certificate/${requestNo}`);
//       return res.data;
//     } catch (err: any) {
//       return rejectWithValue(
//         err.response?.data || { message: "Failed to fetch certificate details" }
//       );
//     }
//   }
// );



// ✅ Async Thunks
export const fetchAllCertificateRequests = createAsyncThunk<
  CertificateAdminState,                                                 // return type
  { page: number; limit: number; search?: string },                     // args
  { rejectValue: { message: string } }
>(
  "certificateAdmin/fetchAll",
  async ({ page, limit, search = "" }, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        ...(search ? { search } : {}),
      });

      const res = await secureApi.get(
        `/api/v1/certificate/admin/all?${query.toString()}`
      );

      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data || { message: "Failed to fetch requests" }
      );
    }
  }
);


// ✅ Slice
const initialState: CertificateAdminState = {
  requests: [],
  loading: false,
  error: null,
  success: false,
  pagination: {
    page: 1,
    limit: 10,
    totalPages: 0,
    totalCount: 0,
  },
};

const certificateAdminSlice = createSlice({
  name: "certificateAdmin",
  initialState,
  reducers: {
    clearCertificateState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔹 Fetch all requests
      .addCase(fetchAllCertificateRequests.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllCertificateRequests.fulfilled, (state, action: PayloadAction<CertificateAdminState>) => {
        state.loading = false;
        state.success = true;
        state.requests = action.payload.requests;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAllCertificateRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCertificateState } = certificateAdminSlice.actions;
export default certificateAdminSlice.reducer;
