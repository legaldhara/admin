import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { secureApi } from "../../config/apiClient"

// interface Pagination {
//   totalPages: number
//   page: number
//   totalUsers: number
//   limit: number
// }


// ✅ Fetch Users
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (
    { page = 1, limit = 10, search = "", isActive, startDate, endDate, lastLoginStart, lastLoginEnd }:
    { page?: number; limit?: number; search?: string; isActive?: string; startDate?: string; endDate?: string; lastLoginStart?: string; lastLoginEnd?: string },
    { rejectWithValue }
  ) => {
    try {
      const query = new URLSearchParams();

      query.append("page", String(page));
      query.append("limit", String(limit));
      if (search) query.append("search", search);
      if (isActive) query.append("isActive", isActive);
      if (startDate) query.append("startDate", startDate);
      if (endDate) query.append("endDate", endDate);
      if (lastLoginStart) query.append("lastLoginStart", lastLoginStart);
      if (lastLoginEnd) query.append("lastLoginEnd", lastLoginEnd);

      const { data } = await secureApi.get(`/api/v1/user/getallusers?${query.toString()}`);

      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch users");
    }
  }
);


export const fetchUserById = createAsyncThunk("users/fetchUserById", async (id: string, { rejectWithValue }) => {
  try {
    const { data } = await secureApi.get(`/api/v1/user/detail/${id}`)
    // server returns { success: true, user } in our controller
    return data.user ?? null
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch user")
  }
})



// ✅ Delete User
export const deleteUser = createAsyncThunk("users/deleteUser", async (id: string, { rejectWithValue }) => {
  try {
    // await secureApi.delete(`${API_URL}/${id}`)
    // return id
    void id;
    
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Failed to delete user")
  }
})

const userSlice = createSlice({
  name: "user",
  initialState: {
    users: [] as any[],
    selectedUser: null as any | null,
    loading: false,
    error: null as string | null,
    success: false,
    pagination: {
      totalPages: 1,
      page: 1,
      totalUsers: 0,
      limit: 10,
    }
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ====================== FETCH USERS ======================
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;

        const payload = action.payload || {};

        state.users = payload.data ?? []; // <-- FIXED
        state.pagination = payload.pagination ?? state.pagination;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ====================== FETCH USER BY ID ======================
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ====================== DELETE USER ======================
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u.id !== action.payload);
      });
  },
});


export default userSlice.reducer
