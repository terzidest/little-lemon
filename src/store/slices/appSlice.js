/**
 * App state store slice
 */
const createAppSlice = (set) => ({
  // App state
  isLoading: false,
  appError: null,
  
  // Set loading state
  setIsLoading: (isLoading) => set({ isLoading }),
  
  // Set app error
  setAppError: (appError) => set({ appError }),
  
  // Reset app error
  resetAppError: () => set({ appError: null }),
});

export default createAppSlice;