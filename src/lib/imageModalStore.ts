import { create } from 'zustand';

interface ImageModalState {
  isOpen: boolean
  imageUrl: string | null
  openModal: (url: string) => void
  closeModal: () => void
}

export const useImageModalStore = create<ImageModalState>((set) => ({
  isOpen: false,
  imageUrl: null,
  openModal: (url) => set({ isOpen: true, imageUrl: url }),
  closeModal: () => set({ isOpen: false, imageUrl: null }),
}))

