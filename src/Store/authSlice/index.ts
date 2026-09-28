import { createSlice } from "@reduxjs/toolkit";
import { signOut } from "firebase/auth";
import { auth } from "../../config/FirebaseConfiguration";
import type { AuthState } from "../../utils/types";

const initialState: AuthState = { authChecking: true, isAuthenticated: false, name: null, email: null, role: null, userId: null, phoneNumber: null, loading: false, error: null, confirmationResult: null, isOTPSent: false };
const slice = createSlice({
  name: "auth", initialState,
  reducers: {
    setAuthChecking: (state, action) => { state.authChecking = action.payload; },
    setUser: (state, action) => { Object.assign(state, action.payload, { isAuthenticated: true, loading: false }); },
    clearUser: (state) => { Object.assign(state, initialState, { authChecking: false }); },
    clearError: (state) => { state.error = null; },
  },
});
export const logout = () => async (dispatch: (action: unknown) => void) => { await signOut(auth); dispatch(slice.actions.clearUser()); };
export const { setAuthChecking, setUser, clearUser, clearError } = slice.actions;
export default slice.reducer;
