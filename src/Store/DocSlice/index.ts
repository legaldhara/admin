import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { secureApi } from "../../config/apiClient";


// ✅ Types


export interface Document {
  id?: string;
  title: string;
  description?: string | null;
  url: string;
  publicId: string;
  user: { fullName?: string, email?: string, createdAt?: string };
  createdAt: string;
  updatedAt: string;
}


export interface Pagination {
  page: number;
  limit: number;
  totalPages: number;
  totalCount: number;
}


export interface DocumentState {
  documents: Document[];
  loading: boolean;
  error: string | null;
  success: boolean;
  message: string | null;
  pagination: Pagination;
}


// ✅ Initial state
const initialState: DocumentState = {
  documents: [],
  loading: false,
  error: null,
  success: false,
  message: null,
  pagination: {
    page: 1,
    limit: 10,
    totalPages: 0,
    totalCount: 0,
  },
};


// ✅ Get all documents (User → own | Admin → all)
export const fetchDocuments = createAsyncThunk<
  any, // API returns grouped data, not a Document[] list
  {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    type?: string;
  },
  { rejectValue: { message: string } }
>(
  "documents/fetchAll",
  async (
    {
      page = 1,
      limit = 10,
      search = "",
      status = "",
      type = "",
    } = {},
    { rejectWithValue }
  ) => {
    try {
      const query = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        ...(search ? { search } : {}),
        ...(status ? { status } : {}),
        ...(type ? { type } : {}),
      });
      const res = await secureApi.get(`/api/v1/document?${query.toString()}`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data || { message: "Failed to fetch documents" }
      );
    }
  }
);



// ✅ Update document (User → own | Admin → any)
export const updateDocument = createAsyncThunk<
  Document, // ✅ return type
  { id: string; title?: string; description?: string }, // ✅ argument type
  { rejectValue: { message: string } }
>("documents/update", async ({ id, title, description }, { rejectWithValue }) => {
  try {
    const res = await axios.patch(`/api/v1/document/${id}`, { title, description });
    return res.data.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data || { message: "Failed to update document" });
  }
});

// ✅ Delete document (User → own | Admin → any)
export const deleteDocument = createAsyncThunk<
  string, // ✅ return deleted ID
  string, // ✅ document ID
  { rejectValue: { message: string } }
>("documents/delete", async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`/api/documents/${id}`);
    return id;
  } catch (err: any) {
    return rejectWithValue(err.response?.data || { message: "Failed to delete document" });
  }
});

// ✅ Slice
const documentSlice = createSlice({
  name: "documents",
  initialState,
  reducers: {
    clearDocumentState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔹 Fetch
      .addCase(fetchDocuments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDocuments.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.documents = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Error fetching documents";
      })

      // 🔹 Update
      .addCase(updateDocument.fulfilled, (state, action: PayloadAction<Document>) => {
        const idx = state.documents.findIndex((d) => d.id === action.payload.id);
        if (idx !== -1) state.documents[idx] = action.payload;
        state.success = true;
      })
      .addCase(updateDocument.rejected, (state, action) => {
        state.error = action.payload?.message || "Error updating document";
      })

      // 🔹 Delete
      .addCase(deleteDocument.fulfilled, (state, action: PayloadAction<string>) => {
        state.documents = state.documents.filter((d) => d.id !== action.payload);
        state.success = true;
      })
      .addCase(deleteDocument.rejected, (state, action) => {
        state.error = action.payload?.message || "Error deleting document";
      });
  },
});

export const { clearDocumentState } = documentSlice.actions;
export default documentSlice.reducer;
