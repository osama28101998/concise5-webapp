import { createSlice } from '@reduxjs/toolkit';

// Load initial state from sessionStorage
const loadState = () => {
  try {
    const serializedState = sessionStorage.getItem('resetPasswordState');
    if (serializedState === null) {
      return {
        userId: null,
        userType: null,
        status: 'idle',
        error: null,
      };
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return {
      userId: null,
      userType: null,
      status: 'idle',
      error: null,
    };
  }
};

const initialState = loadState();

const resetPasswordSlice = createSlice({
  name: 'resetPassword',
  initialState,
  reducers: {
    setResetPasswordData: (state, action) => {
      state.userId = action.payload.userId;
      state.userType = action.payload.userType;
      state.status = 'succeeded';
      // Save to sessionStorage
      try {
        const serializedState = JSON.stringify(state);
        sessionStorage.setItem('resetPasswordState', serializedState);
      } catch (err) {
        console.error('Failed to save state to sessionStorage:', err);
      }
    },
    clearResetPasswordData: (state) => {
      state.userId = null;
      state.userType = null;
      state.status = 'idle';
      state.error = null;
      // Clear from sessionStorage
      try {
        sessionStorage.removeItem('resetPasswordState');
      } catch (err) {
        console.error('Failed to clear state from sessionStorage:', err);
      }
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.status = 'failed';
      // Save to sessionStorage
      try {
        const serializedState = JSON.stringify(state);
        sessionStorage.setItem('resetPasswordState', serializedState);
      } catch (err) {
        console.error('Failed to save state to sessionStorage:', err);
      }
    },
  },
});

export const { setResetPasswordData, clearResetPasswordData, setError } = resetPasswordSlice.actions;
export default resetPasswordSlice.reducer;