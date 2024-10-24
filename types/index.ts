export type Order = {
    price: number;
    quantity: number;
};

export type OrderBook = {
    BUY: Order[];
    SELL: Order[];
};

export type EventOrderBook = {
    id: string,
    orderbook: OrderBook
}
