import { create } from 'zustand'

interface FreshState {
    isSyncing: boolean
    lastSync: Date | null
    setSyncing: (status: boolean) => void
}

export const useFreshStore = create<FreshState>((set) => ({
    isSyncing: false,
    lastSync: null,
    setSyncing: (status) => set({ isSyncing: status, lastSync: status ? null : new Date() }),
}))