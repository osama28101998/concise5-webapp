import { createSlice } from '@reduxjs/toolkit';

// Function to get initial state from localStorage
export const getInitialSettingsState = () => ({
  language: typeof window !== 'undefined' ? localStorage.getItem('language') || 'en' : 'en',
  voice: typeof window !== 'undefined' ? localStorage.getItem('voice') || 'alloy' : 'alloy',
});

const settingsSlice = createSlice({
  name: 'settings',
  initialState: getInitialSettingsState(),
  reducers: {
    setLanguage: (state, action) => {
      state.language = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('language', action.payload);
      }
    },
    setVoice: (state, action) => {
      state.voice = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('voice', action.payload);
      }
    },
  },
});

export const { setLanguage, setVoice } = settingsSlice.actions;
export default settingsSlice.reducer;