"use server";

import { signIn, signOut } from "@/lib/auth";
import executeAction from "@/lib/executeAction"
import { prisma } from "@/lib/prisma";
import { schema } from "@/lib/schema";

const loginGithub = async () => {
    await signIn("github");
}

const logout = async () => {
    await signOut();
}

const signUp = async (formData: FormData) => {
    return executeAction({
        actionFn: async () => {
            const username = formData.get("username");
            const email = formData.get("email");
            const password = formData.get("password");
            const validatedData = schema.parse({ username, email, password })
            await prisma.user.create({
                data: {
                    username: validatedData.username,
                    email: validatedData.email,
                    password: validatedData.password
                }
            })
        },
        successMessage: "Signed up successfully",
    })
}

export { loginGithub, logout, signUp };