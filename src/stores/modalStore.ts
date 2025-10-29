import React from "react";
import { create } from "zustand";

interface ModalState {
    isOpen: boolean;
    title: string;
    body: React.ReactNode;
    openModal: (params: ModalParams) => void;
    closeModal: () => void;
}

interface ModalParams {
    title: string;
    body: React.ReactNode;
}

export const useModalStore = create<ModalState>((set) => ({
    isOpen: false,
    title: "",
    body: null,
    openModal: ({ title, body }) => set({ isOpen: true, title, body }),
    closeModal: () => set({ isOpen: false, title: "", body: null }),
}));
