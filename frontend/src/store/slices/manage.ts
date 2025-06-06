import { type StateCreator } from 'zustand';

type ManageSliceType = {
  isManageSidebarOpen: boolean;
  setIsManageSidebarOpen: (isOpen: boolean) => void;
};

export const createManageSlice: StateCreator<ManageSliceType> = (set): ManageSliceType => ({
  isManageSidebarOpen: false,
  setIsManageSidebarOpen(isOpen) {
    set(() => ({ isManageSidebarOpen: isOpen }));
  },
});
