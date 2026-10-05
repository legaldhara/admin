import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { Pagination, Service } from "../../utils/types"
import { AxiosError } from "axios"
import { secureApi } from "../../config/apiClient"


interface ServicesState {
  services: Service[]
  serviceDetail: Service | null
  loading: boolean
  error: string | null
  success: boolean;
  message: string | null;
  pagination: Pagination
}

const initialState: ServicesState = {
  services: [],
  serviceDetail: null,
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
}

const getErrorMessage = (error: unknown): string => {
  const err = error as AxiosError<{ message?: string }>
  return err?.response?.data?.message || err.message || "Something went wrong"
}

// 1. Get All Services with Pagination
export const fetchServices = createAsyncThunk(
  "services/fetchAll",
  async (
    { page = 1, limit = 10, search = "", status = "", category = "" }: 
    { page?: number; limit?: number; search?: string; status?: string; category?: string },
    { rejectWithValue }
  ) => {
    try {
      const query = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        ...(search ? { search } : {}),
        ...(status ? { status } : {}),
        ...(category ? { category } : {}),
      });

      const res = await secureApi.get(`/api/v1/service/services?${query.toString()}`);

      return res.data;

    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

// 2. Get One Service
export const fetchServiceById = createAsyncThunk(
  "services/fetchById",
  async (id: string, { rejectWithValue }) => {
    if (!id) return rejectWithValue("Service ID is required")
    try {
      const res = await secureApi.get(`/api/v1/api/services/${id}`)
      return res.data.service
    } catch (err) {
      return rejectWithValue(getErrorMessage(err))
    }
  }
)

// 3. Create Service
export const createService = createAsyncThunk(
  "services/create",
  async (newService: Omit<Service, "id" | "createdAt" | "applications" | "payments">, { rejectWithValue }) => {
    try {
      const res = await secureApi.post("/api/v1/service/create", newService)
      return res.data.service
    } catch (err) {
      return rejectWithValue(getErrorMessage(err))
    }
  }
)

// 4. Update Service
export const updateService = createAsyncThunk(
  "services/update",
  async (
    service: { id: string; name: string; description: string; note: string; isActive: boolean },
    { rejectWithValue }
  ) => {
    try {
      const res = await secureApi.put(`/api/v1/service/${service.id}`, service)
      return res.data.service
    } catch (err) {
      return rejectWithValue(getErrorMessage(err))
    }
  }
)


// 5. Soft Delete Service
export const deleteService = createAsyncThunk(
  "services/delete",
  async (id: string, { rejectWithValue }) => {
    if (!id) return rejectWithValue("Service ID is required")
    try {
      const res = await secureApi.delete(`/api/v1/service/${id}`)
      return res.data.service
    } catch (err) {
      return rejectWithValue(getErrorMessage(err))
    }
  }
)

// 🔧 Slice
const servicesSlice = createSlice({
  name: "services",
  initialState,
  reducers: {
    clearServiceDetail: (state) => {
      state.serviceDetail = null
    },
  },
  extraReducers: (builder) => {
    builder

      // FETCH ALL
      .addCase(fetchServices.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading = false
        state.services = action.payload.services
        state.pagination = action.payload.pagination
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // FETCH ONE
      .addCase(fetchServiceById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchServiceById.fulfilled, (state, action) => {
        state.loading = false
        state.serviceDetail = action.payload
      })
      .addCase(fetchServiceById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // CREATE
      .addCase(createService.pending, (state) => {
        state.loading = true
      })
      .addCase(createService.fulfilled, (state, action) => {
        state.loading = false
        state.services.unshift(action.payload)
      })
      .addCase(createService.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // UPDATE
      .addCase(updateService.pending, (state) => {
        state.loading = true
      })
      .addCase(updateService.fulfilled, (state, action) => {
        state.loading = false
        const index = state.services.findIndex(s => s.id === action.payload.id)
        if (index !== -1) state.services[index] = action.payload
        if (state.serviceDetail?.id === action.payload.id) {
          state.serviceDetail = action.payload
        }
      })
      .addCase(updateService.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // DELETE (soft delete)
      .addCase(deleteService.pending, (state) => {
        state.loading = true
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.loading = false
        state.services = state.services.filter(s => s.id !== action.payload.id)
        if (state.serviceDetail?.id === action.payload.id) {
          state.serviceDetail = null
        }
      })
      .addCase(deleteService.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearServiceDetail } = servicesSlice.actions
export default servicesSlice.reducer
