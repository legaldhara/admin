import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { sendOTP, verifyOTP, logout } from '../authSlice/index';

type MessageType = 'info' | 'success' | 'error' | 'warning';

interface MessageState {
  message: string | null;
  type: MessageType;
  open: boolean;
  autoHideDuration: number;
}

const initialState: MessageState = {
  message: null,
  type: 'info',
  open: false,
  autoHideDuration: 5000, // 5 seconds
};

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    showMessage: (state, action: PayloadAction<{ message: string; type?: MessageType; autoHideDuration?: number }>) => {
      state.message = action.payload.message;
      state.type = action.payload.type || 'info';
      state.open = true;
      state.autoHideDuration = action.payload.autoHideDuration || 5000;
    },
    hideMessage: (state) => {
      state.open = false;
    },
  },
  extraReducers: (builder) => {
    // Map auth actions to appropriate messages
    builder.addCase(sendOTP.fulfilled, (state) => {
      state.message = 'OTP sent successfully!';
      state.type = 'success';
      state.open = true;
    });
    builder.addCase(sendOTP.rejected, (state, action) => {
      state.message = `Failed to send OTP: ${action.payload}`;
      state.type = 'error';
      state.open = true;
    });

    builder.addCase(verifyOTP.fulfilled, (state) => {
      state.message = 'Login successful!';
      state.type = 'success';
      state.open = true;
    });
    builder.addCase(verifyOTP.rejected, (state, action) => {
      state.message = `Verification failed: ${action.payload}`;
      state.type = 'error';
      state.open = true;
    });

    // builder.addCase(refreshAuthToken.rejected, (state) => {
    //   state.message = 'Session expired. Please login again.';
    //   state.type = 'warning';
    //   state.open = true;
    // });

    builder.addCase(logout.fulfilled, (state) => {
      // state.message = 'You have been logged out successfully';
      state.type = 'info';
      state.open = true;
    });
  },
});

export const { showMessage, hideMessage } = messageSlice.actions;
export default messageSlice.reducer;