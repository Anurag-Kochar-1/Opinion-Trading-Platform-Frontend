import { api } from "@/lib/axios"

export const signUp = async ({ userId }: { userId: string }): Promise<void> => {
    return (await api.post(`/user/create/${userId}`)).data
}

export const getUserBalance = async ({ userId }: { userId: string }): Promise<{
    statusMessage: string
    statusCode: number
    statusType: "SUCCESS" | "ERROR",
    data: {balance: number, locked: number}
}> => {
    return (await api.get(`/balance/inr/${userId}`)).data
}