import { EventOrderBook } from '@/types';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';


export const DUMMY_EVENT_ORDERBOOK_DATA: EventOrderBook = {
    id: "event_orderbook_3186394",
    orderbook: {

        BUY: [
            { price: 9.5, quantity: 45189 },
            { price: 8.5, quantity: 107039 },
            { price: 7.5, quantity: 41700 },
            { price: 6, quantity: 107018 },
            { price: 5.5, quantity: 53273 },
            { price: 2, quantity: 58805 },
        ],
        SELL: [
            { price: 9.5, quantity: 37591 },
            { price: 8.5, quantity: 59043 },
            { price: 7.5, quantity: 30511 },
            { price: 6.5, quantity: 17183 },
            { price: 5.5, quantity: 51548 },
        ]
    }
}



interface StoreState {
    orderBook: EventOrderBook | null;
    isSignUpModalOpen: boolean;
    userId: string;
    hasUserIdHydrated: boolean;
}

// Separate actions interface
interface StoreActions {
    setOrderBook: (orderBook: EventOrderBook | null) => void;
    setIsSignUpModalOpen: (val: boolean) => void;
    setUserId: (userId: string) => void;
    removeUserId: () => void;
    setHasUserIdHydrated: (state: boolean) => void;
}

type Store = StoreState & StoreActions;

const initialState: StoreState = {
    orderBook: DUMMY_EVENT_ORDERBOOK_DATA,
    isSignUpModalOpen: false,
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

