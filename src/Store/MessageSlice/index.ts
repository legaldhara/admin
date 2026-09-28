import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
});

export const { showMessage, hideMessage } = messageSlice.actions;
export default messageSlice.reducer;
