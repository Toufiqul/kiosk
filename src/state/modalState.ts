import { create } from "zustand";

interface ModalState {
  //   isDepartmentModalOpen: boolean;
  //   isExaminationsModalOpen: boolean;
  //   isCalendarModalOpen: boolean;
  activeModal: string | null;

  //   openDepartmentModal: () => void;
  //   closeDepartmentModal: () => void;

  //   openExaminationsModal: () => void;
  //   closeExaminationsModal: () => void;

  //   openCalendarModal: () => void;
  //   closeCalendarModal: () => void;

  setActiveModal: (modalName: string | null) => void;
  //   closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  //   isDepartmentModalOpen: false,
  //   isExaminationsModalOpen: false,
  //   isCalendarModalOpen: false,
  activeModal: null,

  //   openDepartmentModal: () =>
  //     set({ isDepartmentModalOpen: true, activeModal: "department" }),
  //   closeDepartmentModal: () =>
  //     set({ isDepartmentModalOpen: false, activeModal: null }),

  //   openExaminationsModal: () =>
  //     set({ isExaminationsModalOpen: true, activeModal: "examinations" }),
  //   closeExaminationsModal: () =>
  //     set({ isExaminationsModalOpen: false, activeModal: null }),

  //   openCalendarModal: () =>
  //     set({ isCalendarModalOpen: true, activeModal: "calendar" }),
  //   closeCalendarModal: () =>
  //     set({ isCalendarModalOpen: false, activeModal: null }),

  setActiveModal: (modalName) => set({ activeModal: modalName }),
  //   closeModal: () => set({ activeModal: null }),
}));
