import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../Store/authSlice/index';
import messageReducer from './MessageSlice';
import serviceReducer from './ServiceSlice';
import applicationReducer from './ApplicationSlice';
import userReducer from "./UserSlice/index";
import queryReducer from "./QuerySlice/index";
import paymentReducer from "./PaymentSlice/index";
import documentReducer from "./DocSlice/index";
import certificateReducer from "./CertSlice/index";
import notificationsReducer from './NotificationSlice/index'
import dashboardReducer from "./DashboardSlice/index";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    message: messageReducer,
    service: serviceReducer,
    query: queryReducer,
    payment: paymentReducer,
    user: userReducer,
    application: applicationReducer,
    document: documentReducer,
    certificate: certificateReducer,
    dashboard: dashboardReducer,
    notifications: notificationsReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types since they contain non-serializable data
        ignoredActions: ['auth/sendOTP/fulfilled'],
        // Ignore these field paths in state and actions
        ignoredPaths: ['auth.confirmationResult'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;