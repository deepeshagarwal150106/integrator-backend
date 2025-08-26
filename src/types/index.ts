import {z} from 'zod';

export const SignupSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Invalid email address"),
    password: z.string().min(3, "Password must be at least 3 characters long")
});

export const SigninSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(3, "Password must be at least 3 characters long")
});

export const zapCreateSchema = z.object({
    availableTriggerId: z.string(),
    metadata: z.any().optional(),
    actions: z.array(z.object({
        availableActionId: z.string(),
        metadata: z.any().optional()
    }))
});

