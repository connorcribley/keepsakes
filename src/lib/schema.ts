import { z } from 'zod';

const schema = z.object({
    name: z.string().min(1, "Username is required"),
    email: z.string().email("Invalid email address").min(1, "Email is required"),
    password: z.string().min(1, "Password is required"),
});

type Schema = z.infer<typeof schema>

export { schema, type Schema};