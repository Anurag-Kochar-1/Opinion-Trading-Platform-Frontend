import { api } from "@/lib/axios"

export const signUp = async ({ userId }: { userId: string }): Promise<void> => {
    return (await api.post(`/user/create/${userId}`)).data
}