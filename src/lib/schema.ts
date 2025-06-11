import { z } from 'zod';

const signupSchema = z.object({
    name: z.string().min(1, "Username is required"),
    email: z.string().email("Invalid email address").min(1, "Email is required"),
    password: z.string().min(1, "Password is required"),
});

const loginSchema = z.object({
    email: z.string().email("Invalid email address").min(1, "Email is required"),
    password: z.string().min(1, "Password is required"),
});

type SignupSchema = z.infer<typeof signupSchema>
type LoginSchema = z.infer<typeof loginSchema>

export {
    signupSchema, type SignupSchema,
    loginSchema, type LoginSchema
};