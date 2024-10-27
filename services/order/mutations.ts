import { useMutation } from "@tanstack/react-query"
import { addOrder } from "./apis"
import { useToast } from "@/hooks/use-toast";

export const useAddOrderMutation = () => {
    const { toast } = useToast();
    return useMutation({
        mutationFn: addOrder,
        onSuccess(data) {
            toast({
                variant: "success",
                title: data?.statusMessage
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