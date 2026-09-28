import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { setUser, clearUser, setAuthChecking } from '../Store/authSlice';
import { useSecureApi } from '../config/apiClient';

interface User {
  id: string;
  phoneNumber: string;
  name: string;
  email: string;
  phone?: string | null;
  role: "ADMIN" | "COADMIN" | "USER";
}
interface SessionResponse {
  user?: User;
  mfaVerified?: boolean;
}

export const useAuthListener = () => {
  const dispatch = useDispatch();
  const { secureRequest } = useSecureApi();
  const checkInterval = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    const checkAuthSession = async () => {
      try {
        // Fetch session data using secureRequest
        const res = await secureRequest<SessionResponse>({
          method: 'GET',
          url: '/api/v1/auth/session',
          data: {},
        });

        // If user data is available, set it in the Redux store
        if (res?.user && res.mfaVerified) {
          dispatch(setUser({
            userId: res.user.id,
            phoneNumber: res.user.phone || null,
            email: res.user.email,
            name: res.user.name,
            role: res.user.role,
          }));
        } else {
          dispatch(clearUser());
        }
      } catch (error) {
        console.error('Error fetching session:', error);
        dispatch(clearUser());
      } finally {
        dispatch(setAuthChecking(false));
      }
    };

    // Initial check
    checkAuthSession();

    // Set up periodic check every 5 minutes
    checkInterval.current = setInterval(checkAuthSession, 5 * 60 * 1000);

    // Cleanup
    return () => {
      if (checkInterval.current) {
        clearInterval(checkInterval.current);
      }
    };
  }, [dispatch]);
};
