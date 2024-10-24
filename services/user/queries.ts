import { useQuery } from "@tanstack/react-query"
import { getUserBalance } from "./apis"
import { useStore } from "@/store"

export const useUserBalance = () => {
    const userId = useStore((state) => state.userId)
    return useQuery({
        queryKey: ['USER_BALANCE'],
        queryFn: () => getUserBalance({ userId }),
        refetchInterval: 5 * 1000,
        enabled: !!userId
    })
}