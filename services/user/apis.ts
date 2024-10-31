import { api } from "@/lib/axios"
import { ApiResponse } from "@/types"

export const signUp = async ({ userId }: { userId: string }): Promise<ApiResponse> => {
    return (await api.post(`/user/create/${userId}`)).data
}

export const getUserBalance = async ({ userId }: { userId: string }): Promise<ApiResponse<{ balance: number, locked: number }>> => {
    return (await api.get(`/balance/inr/${userId}`)).data
}

export const onrampBalance = async ({ userId, amount }: { userId: string, amount: number }): Promise<ApiResponse> => {
    return (await api.post("/onramp/inr", { userId, amount })).data
}


export const getUser = async ({ userId }: { userId: string }): Promise<ApiResponse> => {
    return (await api.post("/user/me", { userId })).data
}

export const getUserStockBalance = async ({ userId }: { userId: string }): Promise<ApiResponse<{
    [key: string]: {
        yes: {
            quantity: number;
            locked: number;
        };
        no: {
            quantity: number;
            locked: number;
        };
    }
}>> => {
    return (await api.get(`/balance/stock/${userId}`)).data
}