import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { secureApi } from "../../config/apiClient";

interface Notification {
  id: string;
  title: string;
  body: string;
  role: string;
  createdAt: string;
  isRead: boolean;   // <-- You set this in your backend query
}


// ------------------ THUNKS ------------------

// Fetch notifications list
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (_, thunkAPI) => {
    try {
      const res = await secureApi.get("/api/v1/notification?page=1&limit=20");      
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Fetch unread count
export const fetchUnreadCount = createAsyncThunk(
  "notifications/fetchUnreadCount",
  async (_, thunkAPI) => {
    try {
      const res = await secureApi.get("/api/v1/notification/unread-count");
      return res.data.count;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Mark single read
export const markOneRead = createAsyncThunk(
  "notifications/markOneRead",
  async (id: string, thunkAPI) => {
    try {
      await secureApi.post(`/api/v1/notification/mark-read/${id}`);
      return id;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Mark all read
export const markAllRead = createAsyncThunk(
  "notifications/markAllRead",
  async (_, thunkAPI) => {
    try {
      await secureApi.post(`/api/v1/notification/mark-all-read`);
      return true;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ------------------ SLICE ------------------

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    notifications: [] as Notification[],
    unreadCount: 0,
    loading: false,
    error: null,
  },
  reducers: {
    // Called when socket receives new notification
    onNewAdminNotification: (state) => {
      // Just re-fetch will happen from component
      // But increase unread temporarily (optional)
      state.unreadCount += 1;
    },
  },

  extraReducers: (builder) => {
    // Fetch notifications
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      state.notifications = action.payload;
      state.loading = false;
    });

    // Fetch unread count
    builder.addCase(fetchUnreadCount.fulfilled, (state, action) => {
      state.unreadCount = action.payload;
      state.loading = false;
    });

    // Mark one as read
    builder.addCase(markOneRead.fulfilled, (state, action) => {
      const id = action.payload;
      const n = state.notifications.find((x) => x.id === id);
      if (n) n.isRead = true;
      state.unreadCount = state.notifications.filter((x: any) => !x.isRead).length;
    });

    // Mark all read
    builder.addCase(markAllRead.fulfilled, (state) => {
      state.notifications = state.notifications.map((x) => ({
        ...x,
        isRead: true,
      }));
      state.unreadCount = 0;
    });
  },
});

export const { onNewAdminNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
