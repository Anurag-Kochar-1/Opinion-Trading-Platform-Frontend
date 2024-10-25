import { z } from "zod";

export const onrampBalanceSchema = z.object({
    amount: z.coerce
        .number()
        .min(1)
        .max(100000000)
});



export type OnrampBalanceFormValues = z.infer<typeof onrampBalanceSchema>;