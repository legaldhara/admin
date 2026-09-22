import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../Store/Store';
import { logout, sendOTP, verifyOTP } from '../Store/authSlice';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { showMessage } from '../Store/MessageSlice';

// Create an axios instance for secured endpoints
export const secureApi = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:4001',
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: { resolve: (value?: unknown) => void; reject: (reason?: any) => void; }[] = [];

const processQueue = (error: Error | null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

// Hook for authentication
export const useAuthState = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);

  return {
    ...auth,
    // currentToken,
    sendOTP: (phoneNumber: string, recaptchaVerifier: any) =>
      dispatch(sendOTP({ phoneNumber, recaptchaVerifier })),

    //For Production setup

    verifyOTP: (otp: string) => {
      if (!auth.confirmationResult) {
        dispatch(showMessage({ message: 'Please request OTP first', type: 'error' }));
        return Promise.reject('No confirmation result');
      }
      return dispatch(verifyOTP({ otp, confirmationResult: auth.confirmationResult }));
    },

    // For Local Setup

    // verifyOTP: (otp: string) => {
    //   return dispatch(verifyOTP({ otp }));
    // },

    logout: () => dispatch(logout())
  };
};

// Hook for secure API requests with auto token refresh
export const useSecureApi = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [isTokenRefreshing, setIsTokenRefreshing] = useState(false);

  // Set up request interceptor
  useEffect(() => {
    const requestInterceptor = secureApi.interceptors.request.use(
      async (config) => {
        try {
          // Add CSRF protection header
          config.headers = config.headers || {};
          config.headers['X-Requested-With'] = 'XMLHttpRequest';
          return config;
        } catch (error) {
          console.error('Failed to prepare request:', error);
          dispatch(logout());
          return Promise.reject(new Error('Authentication error'));
        }
      },
      (error) => Promise.reject(error)
    );

    // Set up response interceptor
    const responseInterceptor = secureApi.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (isRefreshing) {
            // If another request is already refreshing, queue this request
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            })
              .then(() => secureApi(originalRequest))
              .catch((err) => Promise.reject(err));
          }

          originalRequest._retry = true;
          isRefreshing = true;
          setIsTokenRefreshing(true);

          try {
            const refreshResponse = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/auth/refresh`, {
              method: 'POST',
              credentials: 'include',
            });

            if (!refreshResponse.ok) {
              throw new Error('Refresh token expired or invalid');
            }

            processQueue(null);
            return secureApi(originalRequest);
          } catch (refreshError) {
            processQueue(refreshError as Error);
            dispatch(logout());
            dispatch(showMessage({
              message: 'Session expired. Please login again.',
              type: 'warning',
              autoHideDuration: 5000,
            }));
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
            setIsTokenRefreshing(false);
          }
        }

        // Handle other error cases
        if (error.response) {
          switch (error.response.status) {
            case 403:
              dispatch(showMessage({
                message: 'You do not have permission to perform this action',
                type: 'error'
              }));
              break;
            case 429:
              dispatch(showMessage({
                message: 'Rate limit exceeded. Please try again later.',
                type: 'warning'
              }));
              break;
            case 500:
              dispatch(showMessage({
                message: 'Server error. Please try again later.',
                type: 'error'
              }));
              break;
            default:
              const errorMessage =
                (error.response.data as { message: string })?.message ||
                'An error occurred. Please try again.';

              dispatch(showMessage({
                message: errorMessage,
                type: 'error'
              }));
          }
        } else if (error.request) {
          dispatch(showMessage({
            message: 'Network error. Please check your connection.',
            type: 'warning'
          }));
        }
        else if (error.message?.includes("TOO_MANY_ATTEMPTS_TRY_LATER")) {
          dispatch(showMessage({
            message: 'Too many request, try later!',
            type: 'warning'
          }));
        }
        else {
          dispatch(showMessage({
            message: 'An error occurred. Please try again.',
            type: 'error'
          }));
        }

        return Promise.reject(error);
      }
    );

    return () => {
      secureApi.interceptors.request.eject(requestInterceptor);
      secureApi.interceptors.response.eject(responseInterceptor);
    };
  }, [dispatch, isAuthenticated, isTokenRefreshing]);

  const secureRequest = async <T>(config: AxiosRequestConfig): Promise<T> => {
    try {
      const response = await secureApi(config);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return { secureRequest };
};