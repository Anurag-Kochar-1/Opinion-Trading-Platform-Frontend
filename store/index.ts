import { EventOrderBook } from '@/types';
import { create } from 'zustand';

const DUMMY_EVENT_ORDERBOOK_DATA: EventOrderBook = {
    id: "event_orderbook_3186394",
    orderbook: {

        BUY: [
            { price: 9.1, quantity: 145189 },
            { price: 7.51, quantity: 41700 },
            { price: 8.5, quantity: 107039 },
            { price: 7.69, quantity: 107018 },
            { price: 7.24, quantity: 53273 },
            { price: 9.16, quantity: 58805 },
        ],
        SELL: [
            { price: 7.89, quantity: 37591 },
            { price: 7.7, quantity: 32339 },
            { price: 3.72, quantity: 17031 },
            { price: 8.39, quantity: 59043 },
            { price: 8.78, quantity: 19230 },
            { price: 8.09, quantity: 35151 },
            { price: 5.48, quantity: 51548 },
            { price: 7.27, quantity: 30511 },
            { price: 5.48, quantity: 9634 },
            { price: 6.09, quantity: 17183 },
            { price: 8.41, quantity: 48912 },
            { price: 4.16, quantity: 17439 },
            { price: 6.18, quantity: 41656 },
        ]
    }
}



interface OrderBookState {
    orderBook: EventOrderBook | null;
    setOrderBook: (orderBook: EventOrderBook | null) => void;
}

export const useOrderBookStore = create<OrderBookState>((set) => ({
    orderBook: DUMMY_EVENT_ORDERBOOK_DATA,
    setOrderBook(orderBook) {
        set({ orderBook })
    },
}));
