"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useStore } from "@/store";
import { signUpFormSchema, SignUpFormValues } from "./schema";
import { useSignUpMutation } from "@/services/user/mutations";
import { generateUsername } from "@/utils";

export function SignUpFormModal() {
  const isSignUpModalOpen = useStore((state) => state.isSignUpModalOpen);
  const setIsSignUpModalOpen = useStore((state) => state.setIsSignUpModalOpen);
  const signUpMutation = useSignUpMutation();

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      username: generateUsername(),
      password: "123456",
    },
  });

  const onSubmit = (data: SignUpFormValues) => {
    signUpMutation.mutate({ userId: data.username });
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
    }
    setIsSignUpModalOpen(open);
  };

  return (
    <Dialog open={isSignUpModalOpen} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create an account</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={signUpMutation.isPending}
            >
              {signUpMutation.isPending ? "Creating account..." : "Sign up"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
