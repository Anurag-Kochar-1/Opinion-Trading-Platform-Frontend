import { z } from "zod";

export const MAX_PRICE = 9.5
export const tradingSchema = z.object({
    price: z.coerce
        .number()
        .min(0.5)
        .max(MAX_PRICE)
        .refine((val) => {
            const decimal = val % 0.5;
            return decimal === 0;
        }, "Price must be in increments of 0.5"),
    quantity: z.coerce.number().int().min(1).max(999),
});



export type TradingFormValues = z.infer<typeof tradingSchema>;