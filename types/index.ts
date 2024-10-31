type Order = Record<string, number>; // string is userId, and number is quantity

type OrderLevel = {
    total: number;
    orders: Order;
};

type OrderBookSide = Record<string, OrderLevel>; // string is price

export type OrderBookEntry = {
    yes: OrderBookSide;
    no: OrderBookSide;
};


export type ApiResponse<T = undefined> = {
    statusMessage: string
    statusCode: number
    statusType: "SUCCESS" | "ERROR"
    data?: T
}


export type StockBalance = {
    yes: {
        quantity: number
        locked: number
    }
    no: {
        quantity: number
        locked: number
    }
}



