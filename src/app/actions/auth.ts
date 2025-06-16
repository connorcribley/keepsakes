"use server";

import bcrypt from 'bcrypt';
import { signIn, signOut } from "@/lib/auth";
import executeAction from "@/lib/executeAction"
import { prisma } from "@/lib/prisma";
import { signupSchema } from "@/lib/schema";

const loginGoogle = async () => {
    await signIn("google");
}

const loginGithub = async () => {
    await signIn("github");
}

const loginFacebook = async () => {
    await signIn("facebook");
}

const logout = async () => {
    await signOut();
}

const signUp = async (formData: FormData) => {
    return executeAction({
        actionFn: async () => {
            const name = formData.get("name");
            const email = formData.get("email");
            const password = formData.get("password");
            const validatedData = signupSchema.parse({ name, email, password })
            const hashedPassword = await bcrypt.hash(validatedData.password, 10);
            await prisma.user.create({
                data: {
                    name: validatedData.name,
                    email: validatedData.email,
                    password: hashedPassword,
                    image: 'https://res.cloudinary.com/dx83fnzoj/image/upload/v1750111768/user_profiles/default-pfp_wm30df.svg'
                }
            })
        },
        successMessage: "Signed up successfully",
    })
}

export { loginGoogle, loginGithub, loginFacebook, logout, signUp };