import { api } from "@/lib/axios"
import { ApiResponse } from "@/types"
import axios from "axios"

export const pingEngineServer = async (): Promise<ApiResponse> => {
    const url = process.env.NEXT_PUBLIC_ENGINE_BACKEND_URL
    if (!url) throw new Error("NEXT_PUBLIC_ENGINE_BACKEND_URL is not defined!")
    return (await axios.get(`${url}/ping`)).data
}

export const pingApiBackendServer = async (): Promise<ApiResponse> => {
    return (await api.get(`/ping`)).data
}