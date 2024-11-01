"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useStore } from "@/store";
import React from "react";
import { useForm } from "react-hook-form";
import { OnrampBalanceFormValues, onrampBalanceSchema } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useOnrampBalanceMutation } from "@/services/user/mutations";

export const OnrampBalanceFormModal = () => {
  const isOnrampBalanceModalOpen = useStore(
    (state) => state.isOnrampBalanceModalOpen
  );
  const setIsOnrampBalanceModalOpen = useStore(
    (state) => state.setIsOnrampBalanceModalOpen
  );

  const form = useForm<OnrampBalanceFormValues>({
    resolver: zodResolver(onrampBalanceSchema),
  });

  const amount = form.watch("amount");

  const onrampBalanceMutation = useOnrampBalanceMutation();

  const onSubmit = (data: OnrampBalanceFormValues) => {
    onrampBalanceMutation.mutate({ amount: data.amount * 100 });
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
    }
    setIsOnrampBalanceModalOpen(open);
  };

  return (
    <Dialog
      open={isOnrampBalanceModalOpen}
      onOpenChange={handleDialogOpenChange}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Balance</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter here in ₹..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={onrampBalanceMutation.isPending}
              className="w-full"
            >
              {" "}
              Pay {amount ? `₹ ${amount}` : null}{" "}
              {onrampBalanceMutation.isPending ? "..." : null}{" "}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
