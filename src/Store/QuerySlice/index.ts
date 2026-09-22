import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { secureApi } from "../../config/apiClient";

interface Pagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}
export interface UserQuery {
  subject: string;
  message: string;
  isResolved: boolean;
  response?: string;
  createdAt: string;
  resolvedAt?: string;
  queryNo: string;
  user: {
    fullName: string;
    email: string;
    phone: string;
  };
}

interface QueryState {
  queries: UserQuery[];
  loading: boolean;
  error: string | null;
  success?: boolean;
  pagination: Pagination;
}

const initialState: QueryState = {
  queries: [],
  loading: false,
  error: null,
  success: false,
  pagination: {
    page: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 0,
  },
};

// Fetch all queries with pagination
export const fetchQueries = createAsyncThunk(
  "queries/fetchAll",
  async (
    {
      page = 1,
      limit = 10,
      search = "",
      role = "",
      city = "",
      emailVerified = "",
      startDate = "",
      endDate = "",
    }: {
      page?: number;
      limit?: number;
      search?: string;
      role?: string;
      city?: string;
      emailVerified?: string | boolean;
      startDate?: string;
      endDate?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const query = new URLSearchParams({
        page: String(page),
        limit: String(limit),

        ...(search ? { search } : {}),
        ...(role ? { role } : {}),
        ...(city ? { city } : {}),

        ...(emailVerified !== "" ? { emailVerified: String(emailVerified) } : {}),

        ...(startDate ? { startDate } : {}),
        ...(endDate ? { endDate } : {}),
      });

      const finalURL = `/api/v1/query/allqueries?${query.toString()}`;
      console.log("FETCH QUERIES URL:", finalURL);

      const res = await secureApi.get(finalURL);

      return res.data; // { success, pagination, queries }
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch queries");
    }
  }
);


// Resolve query
export const resolveQuery = createAsyncThunk(
  "queries/resolve",
  async ({ queryNo, response }: { queryNo: string; response: string }, thunkAPI) => {
    try {
      const res = await secureApi.put(`/api/v1/query/resolve/${encodeURIComponent(queryNo)}`, { response });
      return res.data.response;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const querySlice = createSlice({
  name: "queries",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ========== FETCH ALL QUERIES ==========
      .addCase(fetchQueries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQueries.fulfilled, (state, action) => {
        state.loading = false;

        const payload = action.payload || {};

        state.queries = payload.queries ?? [];

        state.pagination = payload.pagination ?? state.pagination;
      })
      .addCase(fetchQueries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default querySlice.reducer;



