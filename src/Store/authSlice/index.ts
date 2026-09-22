// For Production
import { auth } from '../../config/FirebaseConfiguration';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { AuthState } from '../../utils/types';
import axios from 'axios';

type ConfirmationResultOrDemo = ConfirmationResult | { isDemo: boolean, demoToken?: string };

// Define the initial state
const initialState: AuthState = {
  authChecking: true,
  isAuthenticated: false,
  name: null,
  email: null,
  role: null,
  userId: null,
  phoneNumber: null,
  loading: false,
  error: null,
  confirmationResult: null,
  isOTPSent: false
};

const DEMO_DISTRIBUTOR_PHONE = '+919876543210'; // your demo phone
// const DEMO_OTP = '123456'; // your demo OTP

// // Production
export const sendOTP = createAsyncThunk(
  'auth/sendOTP',
  async (payload: { phoneNumber: string, recaptchaVerifier: any }, { rejectWithValue }) => {
    try {
      const { phoneNumber, recaptchaVerifier } = payload;

      if (phoneNumber === DEMO_DISTRIBUTOR_PHONE) {
        // Get demo token from backend
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_API_URL}/api/v1/auth/validate`,
          { phone: DEMO_DISTRIBUTOR_PHONE }
        );
        if (!res.data?.token) {
          return rejectWithValue('Failed to get demo token');
        }
        return { confirmationResult: { isDemo: true, demoToken: res.data.token }, phoneNumber };
      }

      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      return { confirmationResult, phoneNumber };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to send OTP');
    }
  }
);


// For Production
export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async (payload: { otp: string, confirmationResult: ConfirmationResultOrDemo }, { rejectWithValue }) => {
    try {
      const { otp, confirmationResult } = payload;

      if ('isDemo' in confirmationResult && confirmationResult?.isDemo) {
        // Call backend with demo token and OTP
        const validateRes = await axios.post(
          `${import.meta.env.VITE_BACKEND_API_URL}/api/v1/auth/admin/login`,
          { phone: DEMO_DISTRIBUTOR_PHONE, otp },
          {
            headers: { Authorization: `Bearer ${confirmationResult.demoToken}` },
            withCredentials: true,
          }
        );
        if (!validateRes.data.success) {
          return rejectWithValue(validateRes.data.message || 'Distributor not found');
        }
        const user = validateRes.data.user;
        return {
          userId: user.id,
          phoneNumber: user.phone,
          kycVerified: user.kycVerified ,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      }
      else {

        const userCredential = await (confirmationResult as ConfirmationResult).confirm(otp);

        const user = userCredential.user;
        const idToken = await user.getIdToken(true);

        const validateRes = await axios.post(`${import.meta.env.VITE_BACKEND_API_URL}/api/v1/auth/admin/login`, {
          phone: user?.phoneNumber
        }, {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
          withCredentials: true,
        }
        );
        
        console.log("user login data", validateRes);
        const userData = validateRes.data

        if (!validateRes.data.success) {
          return rejectWithValue(validateRes.data.message || 'Distributor not found');
        }

        return {
          userId: userData.uid,
          phoneNumber: userData.phoneNumber,
          kycVerified: userData.kycVerified ,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          referralCode: userData.referralCode,
        };
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Invalid OTP');
    }
  }
);


export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const validateRes = await axios.post(`${import.meta.env.VITE_BACKEND_API_URL}/api/v1/auth/logout`, _, { withCredentials: true });
      console.log(validateRes);
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to logout');
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthChecking: (state, action) => {
      state.authChecking = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action) => {
      state.userId = action.payload.userId;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.phoneNumber = action.payload.phoneNumber;
      state.isAuthenticated = true;
      state.loading = false;
    },
    clearUser: (state) => {
      state.userId = null;
      state.phoneNumber = null;
      state.isAuthenticated = false;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    // Send OTP cases
    builder.addCase(sendOTP.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(sendOTP.fulfilled, (state, action) => {
      state.loading = false;
      state.confirmationResult = action.payload.confirmationResult as any;  //for Local Setup comment this
      state.phoneNumber = action.payload.phoneNumber;
      state.isOTPSent = true;
    });
    builder.addCase(sendOTP.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.isOTPSent = false;
    });

    // Verify OTP cases
    builder.addCase(verifyOTP.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(verifyOTP.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.userId = action.payload.userId;
      state.phoneNumber = action.payload.phoneNumber;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.confirmationResult = null;
      state.isOTPSent = false;
    });

    builder.addCase(verifyOTP.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Logout cases
    builder.addCase(logout.fulfilled, (state) => {
      state.isAuthenticated = false;
      state.userId = null;
      state.phoneNumber = null;
      state.confirmationResult = null;
      state.isOTPSent = false;
      state.loading = false;
      state.error = null;
    });
    builder.addCase(logout.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  }
});

export const { clearError, setUser, clearUser, setAuthChecking } = authSlice.actions;
export default authSlice.reducer;




