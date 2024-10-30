import { OrderBookEntry } from '@/types';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';



interface StoreState {
    orderBook: OrderBookEntry | null;
    isSignUpModalOpen: boolean;
    isOnrampBalanceModalOpen: boolean;
    userId: string;
    hasUserIdHydrated: boolean;
}


interface StoreActions {
    setOrderBook: (orderBook: OrderBookEntry | null) => void;
    setIsSignUpModalOpen: (val: boolean) => void;
    setIsOnrampBalanceModalOpen: (val: boolean) => void;
    setUserId: (userId: string) => void;
    removeUserId: () => void;
    setHasUserIdHydrated: (state: boolean) => void;
}

type Store = StoreState & StoreActions;

const initialState: StoreState = {
    orderBook: null,
    isSignUpModalOpen: false,
    isOnrampBalanceModalOpen: false,
    userId: '',
    hasUserIdHydrated: false,
};

export const useStore = create<Store>()(
    persist(
        (set) => ({
            ...initialState,

            setOrderBook: (orderBook) =>
                set({ orderBook }),

            setIsSignUpModalOpen: (val) =>
                set({ isSignUpModalOpen: val }),

            setUserId: (userId) =>
                set({ userId }),

            removeUserId: () =>
                set({ userId: '' }),

            setHasUserIdHydrated: (state) =>
                set({ hasUserIdHydrated: state }),

            setIsOnrampBalanceModalOpen(val) {
                set({ isOnrampBalanceModalOpen: val })
            },
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                userId: state.userId
            }),
            onRehydrateStorage: () => (state) => {
                state?.setHasUserIdHydrated(true);
            },

        }
    )
);

