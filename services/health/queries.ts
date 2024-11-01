import { useQuery } from "@tanstack/react-query"
import { pingApiBackendServer, pingEngineServer } from "./api"

const OneHoureInMs = 1000 * 60 * 60 * 1;
const queryOptions = {
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
    staleTime: OneHoureInMs,
    gcTime: Infinity
}

export const usePingEngineServerQuery = () => {
    return useQuery({
        queryFn: pingEngineServer,
        queryKey: ['PING_ENGINE_SERVER'],
        ...queryOptions
    })
}
export const usePingApiBackendServerQuery = () => {
    return useQuery({
        queryFn: pingApiBackendServer,
        queryKey: ['PING_API_BACKEND_SERVER'],
        ...queryOptions
    })
}