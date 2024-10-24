import * as z from 'zod';

export const signUpFormSchema = z.object({
    username: z
        .string()
        .min(3, { message: 'Username must be at least 3 characters' })
        .max(20, { message: 'Username must be less than 20 characters' }),
    password: z
        .string()
        .min(6, { message: 'Password must be at least 6 characters' })
        .max(50, { message: 'Password must be less than 50 characters' }),
});

export type SignUpFormValues = z.infer<typeof signUpFormSchema>;