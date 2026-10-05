import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Application, ApplicationDetails, Pagination } from "../../utils/types";
import { secureApi } from "../../config/apiClient";

export type ApplicationStatus =
    | "AWAITING_ACTION"
    | "PAYMENT_REQUIRED"
    | "PAYMENT_DONE"
    | "UNDER_REVIEW"
    | "DATA_REQUIRED"
    | "APPROVED"
    | "REJECTED"
    | "COMPLETED"
    | "CLOSED";

export type UpdateType =
    | "USER_MESSAGE"
    | "ADMIN_MESSAGE"
    | "PAYMENT_SUCCESS"
    | "PAYMENT_FAILED"
    | "STATUS_CHANGE"
    | "DOCUMENT_UPDATED"
    | "PAYMENT_REQUESTED"
    | "SYSTEM_GENERATED";

// interface ApplicationStatusUpdate {
//     message: string;
//     updateCharges: number;
//     meta: any;
//     docRequired: true;
//     paymentRequired: true;
//     statusAction: ApplicationStatus;
//     updateType: string;
// }

interface ApplicationState {
    applications: Application[];
    application: ApplicationDetails | null;
    loading: boolean;
    error: string | null;
    success: boolean;
    message: string | null;
    pagination: Pagination;
}

const initialState: ApplicationState = {
    applications: [],
    application: null,
    loading: false,
    error: null,
    success: false,
    message: null,
    pagination: {
        page: 1,
        limit: 10,
        totalPages: 0,
        totalApplications: 0,
    },
};

// Async Thunks

// export const fetchApplications = createAsyncThunk(
//     "application/fetchApplications",
//     async ({ page = 1, limit = 10 }: { page?: number; limit?: number }, thunkAPI) => {
//         try {
//             const res = await secureApi.get(`/api/v1/application/apps/all?page=${page}&limit=${limit}`, {
//                 withCredentials: true,
//             });

//             return res.data;
//         } catch (error: any) {
//             return thunkAPI.rejectWithValue(error?.response?.data?.message || "Failed to fetch applications");
//         }
//     }
// );
export const fetchApplications = createAsyncThunk(
  "application/fetchApplications",
  async ({ page = 1, limit = 10, search, status, startDate, endDate }: any, thunkAPI) => {
    try {
      const query = new URLSearchParams({
        page,
        limit,
        ...(search ? { search } : {}),
        ...(status ? { status } : {}),
        ...(startDate ? { startDate } : {}),
        ...(endDate ? { endDate } : {}),
      });

      const res = await secureApi.get(`/api/v1/application/apps/all?${query.toString()}`, {
        withCredentials: true,
      });

      return res.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data?.message || "Failed to fetch applications");
    }
  }
);


export const getApplicationById = createAsyncThunk(
    "application/getApplicationById",
    async (ticketNo: string, thunkAPI) => {
        try {
            const res = await secureApi.get(`/api/v1/application/${ticketNo}`, {
                withCredentials: true,
            });
            return res.data.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error?.response?.data?.message || "Failed to fetch application");
        }
    }
);

export const updateApplicationStatus = createAsyncThunk(
    "application/updateApplication",
    async ({ ticketNo, data }: {
        ticketNo: string; data: {
            message?: string,
            statusAction?: string,
            paymentRequired?: true,
            updateCharges?: number,
            meta?: any,
            docRequired?: true,
            updateType?: string
        }
    }, thunkAPI) => {

        try {
            const res = await secureApi.post(`/api/v1/application/update/${ticketNo}`, data, {
                withCredentials: true,
            });
            return res.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error?.response?.data?.message || "Failed to update application");
        }
    }
);

export const deleteApplication = createAsyncThunk(
    "application/deleteApplication",
    async (id: string, thunkAPI) => {
        try {
            const res = await secureApi.delete(`/api/v1/application/${id}`);
            return res.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error?.response?.data?.message || "Failed to update application");
        }
    }
);

// Slice

const applicationSlice = createSlice({
    name: "application",
    initialState,
    reducers: {
        // setCurrentApplication: (state) => {

        // },
        resetApplicationState: (state) => {
            state.success = false;
            state.error = null;
            state.message = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch All
            .addCase(fetchApplications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchApplications.fulfilled, (state, action) => {
                state.loading = false;
                state.applications = action.payload.data;
                state.pagination = {
                    page: action.payload.page,
                    limit: action.payload.limit,
                    totalPages: action.payload.totalPages,
                    totalApplications: action.payload.totalApplications,
                };
            })
            .addCase(fetchApplications.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Get by ID
            .addCase(getApplicationById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getApplicationById.fulfilled, (state, action) => {
                state.loading = false;
                state.application = action.payload;
            })
            .addCase(getApplicationById.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update
            .addCase(updateApplicationStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateApplicationStatus.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload.message;
            })
            .addCase(updateApplicationStatus.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            })

            //delete
            .addCase(deleteApplication.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteApplication.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload.message;
            })
            .addCase(deleteApplication.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// Exports
export const { resetApplicationState } = applicationSlice.actions;
export default applicationSlice.reducer;
