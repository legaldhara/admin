import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { secureApi } from "../../config/apiClient";

// Base API
const API_BASE = "/api/v1/analytics";

// ======================
// 📦 Interfaces
// ======================

export interface UserSummary {
  totalUsers: number;
  totalAdmins: number;
  totalCoadmins: number;
  newToday: number;
  newThisMonth: number;
  activeUsers: number;
  percent: {
    daily: number;
    monthly: number;
  };
}

export interface MonthlyUser {
  month: string;
  count: number;
}

export interface ApplicationStatusCount {
  [status: string]: number;
}

export interface ApplicationServiceCount {
  serviceId: string;
  serviceName: string;
  count: number;
}

export interface ApplicationTrend {
  labels: string[];
  values: number[];
}

export interface PaymentSummary {
  totalPayments: number;
  totalRevenue: number;
  statusBreakdown: Record<string, number>;
}

export interface PaymentTypeData {
  paymentType: string;
  count: number;
  totalAmount: number;
}

export interface CertificateStats {
  [status: string]: number;
}

export interface RecentActivity {
  recentLogins: {
    fullName: string;
    email: string;
    phone?: string
    createdAt?: string
    lastLogin?: string
  }[] | [];
  recentSignups: {

    fullName: string;
    email: string;
    createdAt?: string
    phone?: string
    lastLogin?: string
  }[] | [];
}

export interface QueryStats {
  totalQueries: number;
  resolved: number;
  pending: number;
}

export interface DashboardState {
  userSummary: UserSummary | null
  monthlyUsers: MonthlyUser[];
  appStatus: ApplicationStatusCount | null;
  appService: ApplicationServiceCount[];
  appTrend: ApplicationTrend | null;
  paymentSummary: PaymentSummary | null;
  paymentType: PaymentTypeData[];
  certStats: CertificateStats | null;
  userActivity: RecentActivity | null;
  queryStats: QueryStats | null;
  loading: boolean;
  error: string | null;
}

// ======================
// 🧩 Initial State
// ======================
const initialState: DashboardState = {
  userSummary: null,
  monthlyUsers: [],
  appStatus: null,
  appService: [],
  appTrend: null,
  paymentSummary: null,
  paymentType: [],
  certStats: null,
  userActivity: null,
  queryStats: null,
  loading: false,
  error: null,
};

// ======================
// 🚀 Thunks
// ======================

export const fetchUserSummary = createAsyncThunk("dashboard/userSummary", async () => {
  const { data } = await secureApi.get<{ data: UserSummary }>(`${API_BASE}/users/summary`);
  return data.data;
});

export const fetchMonthlyUsers = createAsyncThunk("dashboard/monthlyUsers", async () => {
  const { data } = await secureApi.get<{ data: MonthlyUser[] }>(`${API_BASE}/users/monthly`);
  return data.data;
});

export const fetchRecentUserActivity = createAsyncThunk("dashboard/recentActivity", async () => {
  const { data } = await secureApi.get<{ data: RecentActivity }>(`${API_BASE}/users/activity`);
  return data.data;
});

export const fetchAppStatus = createAsyncThunk("dashboard/appStatus", async () => {
  const { data } = await secureApi.get<{ data: ApplicationStatusCount }>(`${API_BASE}/applications/status`);
  return data.data;
});

export const fetchAppService = createAsyncThunk("dashboard/appService", async () => {
  const { data } = await secureApi.get<{ data: ApplicationServiceCount[] }>(`${API_BASE}/applications/service`);
  return data.data;
});

export const fetchAppTrend = createAsyncThunk("dashboard/appTrend", async (year?: number) => {
  const { data } = await secureApi.get<{ data: ApplicationTrend }>(
    `${API_BASE}/applications/trend${year ? `?year=${year}` : ""}`
  );
  return data.data;
});

export const fetchPaymentSummary = createAsyncThunk("dashboard/paymentSummary", async () => {
  const { data } = await secureApi.get<{ data: PaymentSummary }>(`${API_BASE}/payments/summary`);
  return data.data;
});

export const fetchPaymentType = createAsyncThunk("dashboard/paymentType", async () => {
  const { data } = await secureApi.get<{ data: PaymentTypeData[] }>(`${API_BASE}/payments/type`);
  return data.data;
});

export const fetchCertificateStats = createAsyncThunk("dashboard/certificateStats", async () => {
  const { data } = await secureApi.get<{ data: CertificateStats }>(`${API_BASE}/certificates/requests`);
  return data.data;
});

export const fetchQueryStats = createAsyncThunk("dashboard/queryStats", async () => {
  const { data } = await secureApi.get<{ data: QueryStats }>(`${API_BASE}/queries/stats`);
  return data.data;
});

// ======================
// ⚙️ Slice
// ======================
const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    resetDashboard: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserSummary.fulfilled, (state, action: PayloadAction<UserSummary>) => {
        state.userSummary = action.payload;
      })
      .addCase(fetchMonthlyUsers.fulfilled, (state, action: PayloadAction<MonthlyUser[]>) => {
        state.monthlyUsers = action.payload;
      })
      .addCase(fetchRecentUserActivity.fulfilled, (state, action: PayloadAction<RecentActivity>) => {
        state.userActivity = action.payload;
      })
      .addCase(fetchAppStatus.fulfilled, (state, action: PayloadAction<ApplicationStatusCount>) => {
        state.appStatus = action.payload;
      })
      .addCase(fetchAppService.fulfilled, (state, action: PayloadAction<ApplicationServiceCount[]>) => {
        state.appService = action.payload;
      })
      .addCase(fetchAppTrend.fulfilled, (state, action: PayloadAction<ApplicationTrend>) => {
        state.appTrend = action.payload;
      })
      .addCase(fetchPaymentSummary.fulfilled, (state, action: PayloadAction<PaymentSummary>) => {
        state.paymentSummary = action.payload;
      })
      .addCase(fetchPaymentType.fulfilled, (state, action: PayloadAction<PaymentTypeData[]>) => {
        state.paymentType = action.payload;
      })
      .addCase(fetchCertificateStats.fulfilled, (state, action: PayloadAction<CertificateStats>) => {
        state.certStats = action.payload;
      })
      .addCase(fetchQueryStats.fulfilled, (state, action: PayloadAction<QueryStats>) => {
        state.queryStats = action.payload;
      });
  },
});

export const { resetDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;
