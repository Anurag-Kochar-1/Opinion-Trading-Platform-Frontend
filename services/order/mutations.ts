import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addOrder } from "./apis"
import { useToast } from "@/hooks/use-toast";
import { useParams } from "next/navigation";

export const useAddOrderMutation = () => {
    const { id } = useParams()
    const stockSymbol = String(id)
    const queryClient = useQueryClient()
    const { toast } = useToast();
    return useMutation({
        mutationFn: addOrder,
        onSuccess(data) {
            toast({
                variant: "success",
                title: data?.statusMessage
            })
            queryClient.invalidateQueries({
                queryKey: ['USER_BALANCE']
            })
            queryClient.invalidateQueries({
                queryKey: ['USER_STOCK_BALANCE']
            })
            queryClient.invalidateQueries({
                queryKey: ['USER_STOCK_BALANCE', { stockSymbol }]
            })
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
            console.log(error)
            toast({
                title: error?.response?.data?.statusMessage || "Error",
                variant: "destructive",
            });
        },
    })
}