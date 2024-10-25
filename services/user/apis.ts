import { api } from "@/lib/axios"
import { ApiResponse } from "@/types"

export const signUp = async ({ userId }: { userId: string }): Promise<void> => {
    return (await api.post(`/user/create/${userId}`)).data
}

export const getUserBalance = async ({ userId }: { userId: string }): Promise<ApiResponse<{ balance: number, locked: number }>> => {
    return (await api.get(`/balance/inr/${userId}`)).data
}

export const onrampBalance = async ({ userId, amount }: { userId: string, amount: number }): Promise<ApiResponse> => {
    return (await api.post("/onramp/inr", {userId, amount})).data
 } 