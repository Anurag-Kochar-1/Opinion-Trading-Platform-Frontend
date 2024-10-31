import { api } from "@/lib/axios";
import { ApiResponse } from "@/types";

export const getAllStockSymbols = async (): Promise<ApiResponse<Array<{ symbol: string, totalOrders: number }>>> => {
    return (await api.get(`/symbol`)).data
}