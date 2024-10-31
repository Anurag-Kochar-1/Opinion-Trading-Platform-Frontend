import { useQuery } from "@tanstack/react-query"
import { getAllStockSymbols } from "./apis"

export const useAllStockSymbolsQuery = () => {
    return useQuery({
        queryFn: getAllStockSymbols,
        queryKey: ['STOCK_SYMBOLS']
    })
}