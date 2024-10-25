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


export type ApiResponse<T = undefined> = {
    statusMessage: string
    statusCode: number
    statusType: "SUCCESS" | "ERROR"
    data?: T
}
