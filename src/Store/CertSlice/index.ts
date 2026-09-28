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
//       console.log("Fetched Certificate Details:", res.data);
//       return res.data;
//     } catch (err: any) {
//       console.error("Error fetching certificate details:", err);
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
      console.log(err)
      return rejectWithValue(
        err.response?.data || { message: "Failed to fetch requests" }
      );
    }
  }
);


export const updateCertificateStatus = createAsyncThunk<
  CertificateRequest,
  { requestNo: string; attachmentAssetId?: string | null; message?: string; status: CertificateRequest["status"] },
  { rejectValue: { message: string } }
>("certificateAdmin/updateStatus", async ({ requestNo, attachmentAssetId, message, status }, { rejectWithValue }) => {
  try {
    const res = await secureApi.put(`/api/v1/certificate/${requestNo}/update`, { status, message, attachmentAssetId });
    return res.data.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data || { message: "Failed to update status" });
  }
});

export const addCertificateUpdate = createAsyncThunk<
  any, // you can replace with proper response type if known
  { rejectValue: { message: string } }
>("certificateAdmin/addUpdate", async (data, { rejectWithValue }) => {
  try {
    const res = await secureApi.post("/api/certificates/admin/update", data);
    return res.data.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data || { message: "Failed to add update" });
  }
});

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
      })

      
      // 🔹 Update status
      .addCase(updateCertificateStatus.fulfilled, (state, action: PayloadAction<CertificateRequest>) => {
        const index = state.requests.findIndex((r) => r.id === action.payload.id);
        if (index !== -1) state.requests[index] = action.payload;
        state.success = true;
      })
      .addCase(updateCertificateStatus.rejected, (state, action) => {
        state.error = action.payload;
      })

      // 🔹 Add update
      .addCase(addCertificateUpdate.fulfilled, (state) => {
        state.success = true;
      })
      .addCase(addCertificateUpdate.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearCertificateState } = certificateAdminSlice.actions;
export default certificateAdminSlice.reducer;
