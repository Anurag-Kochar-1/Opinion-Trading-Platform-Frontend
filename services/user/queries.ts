import { useQuery } from "@tanstack/react-query"
import { getUser, getUserBalance } from "./apis"
import { useStore } from "@/store"

export const useUserBalance = () => {
    const userId = useStore((state) => state.userId)
    const { data: userData } = useUser()

    return useQuery({
        queryKey: ['USER_BALANCE'],
        queryFn: () => getUserBalance({ userId }),
        refetchInterval: 5 * 1000,
        enabled: userData?.statusCode === 200,
        retry: false,
        refetchIntervalInBackground: false
    })
}

export const useUser = () => {
    const userId = useStore((state) => state.userId)
    return useQuery({
        queryKey: ['USER'],
        queryFn: () => getUser({ userId }),
        enabled: !!userId,
        retry: false,
    })
}