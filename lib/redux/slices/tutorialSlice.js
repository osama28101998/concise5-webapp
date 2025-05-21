// import { createSlice } from "@reduxjs/toolkit";

// const tutorialSlice = createSlice({
//   name: "tutorial",
//   initialState: {
//     selectedTutorial: null,
//   },
//   reducers: {
//     setSelectedTutorial: (state, action) => {
//       state.selectedTutorial = action.payload;
//     },
//     clearSelectedTutorial: (state) => {
//       state.selectedTutorial = null;
//     },
//   },
// });

// export const { setSelectedTutorial, clearSelectedTutorial } = tutorialSlice.actions;
// export default tutorialSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const loadTutorialFromStorage = () => {
  if (typeof window !== "undefined") {
    const stored = sessionStorage.getItem("selectedTutorial");
    return stored ? JSON.parse(stored) : null;
  }
  return null;
};

const tutorialSlice = createSlice({
  name: "tutorial",
  initialState: {
    selectedTutorial: loadTutorialFromStorage(),
  },
  reducers: {
    setSelectedTutorial: (state, action) => {
      state.selectedTutorial = action.payload;
      // Save to sessionStorage
      if (typeof window !== "undefined") {
        sessionStorage.setItem("selectedTutorial", JSON.stringify(action.payload));
      }
    },
    clearSelectedTutorial: (state) => {
      state.selectedTutorial = null;
      // Clear from sessionStorage
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("selectedTutorial");
      }
    },
  },
});

export const { setSelectedTutorial, clearSelectedTutorial } = tutorialSlice.actions;
export default tutorialSlice.reducer;