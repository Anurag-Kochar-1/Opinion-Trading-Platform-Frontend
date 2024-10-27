import { api } from "@/lib/axios"
import { ApiResponse } from "@/types"

export const addOrder = async (body: {
    stockType: "yes" | "no",
    orderType: "sell" | "buy"
    userId: string,
    stockSymbol: string
    price: number
    quantity: number
}): Promise<ApiResponse> => {
    return (await api.post(`/order/${body.orderType}`)).data
}