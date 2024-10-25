import { useMutation, useQueryClient } from "@tanstack/react-query";
import { onrampBalance, signUp } from "./apis";
import { useStore } from "@/store";
import { useToast } from "@/hooks/use-toast";

export const useSignUpMutation = () => {
    const { toast } = useToast();
    const setUserId = useStore((state) => state.setUserId);
    const setIsSignUpModalOpen = useStore((state) => state.setIsSignUpModalOpen);
    return useMutation({
        mutationFn: signUp,
        onSuccess(data, variables) {

            setUserId(variables.userId)
            toast({
                title: "Success",
                description: "Your account has been created.",
            });
            setIsSignUpModalOpen(false);
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
            console.log(error)
            toast({
                title: error?.response?.data?.statusMessage || "Error",
                variant: "destructive",
            });
        },
    });
}

export const useOnrampBalanceMutation = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient()
    const userId = useStore((state) => state.userId);
    const setIsOnrampBalanceModalOpen = useStore((state) => state.setIsOnrampBalanceModalOpen);
    return useMutation({
        mutationFn: ({amount}: {amount:number}) => onrampBalance({amount, userId}),
        onSuccess(data, variables) {
            console.log(`data from on ramp post`)
            console.log(data)
            queryClient.invalidateQueries({ queryKey: ['USER_BALANCE'] })
            toast({
                title: "Success",
                description: `${variables.amount} INR has been added into your account.`,
            });
            setIsOnrampBalanceModalOpen(false);
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
            console.log(error)
            toast({
                title: error?.response?.data?.statusMessage || "Error",
                variant: "destructive",
            });
        },
    });
}