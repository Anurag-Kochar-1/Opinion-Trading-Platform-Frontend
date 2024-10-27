import { useMutation, useQueryClient } from "@tanstack/react-query";
import { onrampBalance, signUp } from "./apis";
import { useStore } from "@/store";
import { useToast } from "@/hooks/use-toast";

export const useSignUpMutation = () => {
    const queryClient = useQueryClient()
    const { toast } = useToast()
    const setUserId = useStore((state) => state.setUserId);
    const setIsSignUpModalOpen = useStore((state) => state.setIsSignUpModalOpen);
    return useMutation({
        mutationFn: signUp,
        onSuccess(data, variables) {
            toast({
                title: data?.statusMessage,
                variant: "success"
            })
            queryClient.invalidateQueries({
                queryKey: ['USER']
            })
            queryClient.invalidateQueries({
                queryKey: ['USER_BALANCE']
            })
            setUserId(variables.userId)
            setIsSignUpModalOpen(false);
        },

    });
}

export const useOnrampBalanceMutation = () => {
    const { toast } = useToast()
    const queryClient = useQueryClient()
    const userId = useStore((state) => state.userId);
    const setIsOnrampBalanceModalOpen = useStore((state) => state.setIsOnrampBalanceModalOpen);
    return useMutation({
        mutationFn: ({ amount }: { amount: number }) => onrampBalance({ amount, userId }),
        onSuccess(data) {
            toast({
                title: data?.statusMessage,
                variant: "success"
            })
            queryClient.invalidateQueries({ queryKey: ['USER_BALANCE'] })
            setIsOnrampBalanceModalOpen(false);
        },
    });
}