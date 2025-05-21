import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authSlice  from './slices/authSlice';
import tutorialReducer from "./slices/tutorialSlice";
import resetPasswordReducer from "./slices/resetPasswordSlice";
import settingReducer from "./slices/settingsSlice";


const persistConfig = {
  key: 'root',
  storage,
};
const persistedReducer = persistReducer(persistConfig, authSlice);

export const store = configureStore({
  reducer: {
    auth: persistedReducer,
    tutorial: tutorialReducer,
    resetPassword: resetPasswordReducer,
    settings:settingReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});
export const persistor = persistStore(store);

