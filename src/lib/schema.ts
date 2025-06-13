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

const locationSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
})

type SignupSchema = z.infer<typeof signupSchema>
type LoginSchema = z.infer<typeof loginSchema>
type LocationSchema = z.infer<typeof locationSchema>

export {
    signupSchema, type SignupSchema,
    loginSchema, type LoginSchema,
    locationSchema, type LocationSchema
};