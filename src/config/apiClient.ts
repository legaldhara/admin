import axios, { AxiosRequestConfig } from "axios";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "./FirebaseConfiguration";
import { clearUser, logout, setUser } from "../Store/authSlice";
import type { AppDispatch, RootState } from "../Store/Store";

export interface AdminSession {
  success: boolean;
  user: {
    id: string;
    name: string;
    email?: string;
    phone?: string | null;
    role: "ADMIN" | "COADMIN" | "USER";
  };
  mfaEnrolled: boolean;
  mfaVerified: boolean;
}

export const secureApi = axios.create({ baseURL: import.meta.env.VITE_BACKEND_API_URL || "http://localhost:4001", withCredentials: true });
secureApi.interceptors.request.use(async (config) => {
  const token = await auth.currentUser?.getIdToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const useAuthState = () => {
  const dispatch = useDispatch<AppDispatch>();
  const state = useSelector((root: RootState) => root.auth);
  const acceptSession = useCallback((session: AdminSession) => {
    dispatch(setUser({
      userId: session.user.id,
      name: session.user.name,
      email: session.user.email || null,
      phoneNumber: session.user.phone || null,
      role: session.user.role,
    }));
  }, [dispatch]);
  const refreshSession = useCallback(async () => {
    const { data } = await secureApi.get<AdminSession>("/api/v1/auth/session");
    if (!data.mfaVerified) throw new Error("MFA verification required");
    acceptSession(data);
    return data;
  }, [acceptSession]);

  return {
    ...state,
    login: useCallback(async (email: string, password: string) => {
      await signInWithEmailAndPassword(auth, email, password);
      const { data } = await secureApi.get<AdminSession>("/api/v1/auth/session");
      return data;
    }, []),
    enrollMfa: useCallback(async () => {
      const { data } = await secureApi.post("/api/v1/auth/mfa/enroll");
      return data.enrollment as { secret: string; otpauth: string };
    }, []),
    confirmMfa: useCallback(async (code: string) => {
      const { data } = await secureApi.post("/api/v1/auth/mfa/confirm", { code });
      return { recoveryCodes: data.recoveryCodes as string[] };
    }, []),
    verifyMfa: useCallback(async (input: { code?: string; recoveryCode?: string }) => {
      await secureApi.post("/api/v1/auth/mfa/verify", input);
    }, []),
    skipMfa: useCallback(async () => {
      await secureApi.post("/api/v1/auth/mfa/skip-development");
    }, []),
    refreshSession,
    acceptSession,
    logout: () => dispatch(logout()),
    clear: () => dispatch(clearUser()),
  };
};

export const useSecureApi = () => ({
  secureRequest: async <T>(config: AxiosRequestConfig): Promise<T> => (await secureApi(config)).data,
});
