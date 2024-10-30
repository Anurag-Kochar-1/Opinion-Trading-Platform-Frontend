import { api } from "@/lib/axios"
import { ApiResponse, OrderBookEntry } from "@/types"

export const addOrder = async (body: {
    stockType: "yes" | "no",
    orderType: "sell" | "buy"
    userId: string,
    stockSymbol: string
    price: number
    quantity: number
}): Promise<ApiResponse> => {
    return (await api.post(`/order/${body.orderType}`, body)).data
}

export const getOrderBookByStockSymbol = async ({ stockSymbol }: { stockSymbol: string }): Promise<ApiResponse<OrderBookEntry>> => {
    return (await api.get(`/orderbook/${stockSymbol}`)).data
}