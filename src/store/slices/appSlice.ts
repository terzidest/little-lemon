import type { StateCreator } from 'zustand';
import type { StoreState, AppState, AppActions } from '../types';

export type AppSlice = AppState & AppActions;

const createAppSlice: StateCreator<StoreState, [], [], AppSlice> = (set) => ({
  isLoading: false,
  appError: null,
  setIsLoading: (isLoading) => set({ isLoading }),
  setAppError: (appError) => set({ appError }),
  resetAppError: () => set({ appError: null }),
});

export default createAppSlice;
