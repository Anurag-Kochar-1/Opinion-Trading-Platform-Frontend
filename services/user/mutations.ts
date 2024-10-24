import { useMutation } from "@tanstack/react-query";
import { signUp } from "./apis";
import { useStore } from "@/store";
import { useToast } from "@/hooks/use-toast";

export const useSignUpMutation = () => {
    const { toast } = useToast();
    const setUserId = useStore((state) => state.setUserId);
    const setIsSignUpModalOpen = useStore((state) => state.setIsSignUpModalOpen);
    return useMutation({
        mutationFn: signUp,
        onSuccess(data, variables) {
            console.log(data)
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