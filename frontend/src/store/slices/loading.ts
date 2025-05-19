import { type StateCreator } from 'zustand';

type LoadingSliceType = {
  isMarkerLoading: boolean;
  setIsMarkerLoading: (isLoading: boolean) => void;
};

export const createLoadingSlice: StateCreator<LoadingSliceType> = (set): LoadingSliceType => ({
  isMarkerLoading: false,
  setIsMarkerLoading(isLoading) {
    set(() => ({ isMarkerLoading: isLoading }));
  },
});
