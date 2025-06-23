"use server";

// import bcrypt from 'bcrypt';
import { signIn, signOut } from "@/lib/auth";
// import executeAction from "@/lib/executeAction"
// import { prisma } from "@/lib/prisma";
// import { signupSchema } from "@/lib/schema";

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

/* const signUp = async (formData: FormData) => {
    try {
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const validatedData = signupSchema.parse({ name, email, password })
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    await prisma.user.create({
        data: {
            name: validatedData.name,
            email: validatedData.email,
            password: hashedPassword,
            image: 'https://res.cloudinary.com/dx83fnzoj/image/upload/v1750111768/user_profiles/default-pfp_wm30df.svg',
            emailVerified: null,
            verificationCode,
            codeExpiresAt: new Date(Date.now() + 1000 * 60 * 10)
        }
    });
    } catch (error) {
        return {success: false, message: error}
    }

    return {success: true, message: "User successfully created"};
}

const signupAction = async (formData: FormData) => {

    // Google reCAPTCHA vs (invisible)
    const token = formData.get('g-recaptcha-response');

    // Verify the token on the server
    const verifyRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            secret: process.env.RECAPTCHA_SECRET_KEY!,
            response: token as string
        })
    });

    const verifyData = await verifyRes.json();

    if (!verifyData.success) {
        console.error('reCAPTCHA failed:', verifyData['error-codes']);
        throw new Error('Invalid reCAPTCHA. Please try again.');
    }

    // Signup
    const res = await signUp(formData);

    if (res.success) {
        await executeAction({
            actionFn: async () => {
                await signIn('credentials', {
                    redirect: false,
                    email: formData.get('email') as string,
                    password: formData.get('password') as string,
                })
            }
        })

        return { success: true, email: String(formData.get('email')) };
    } else {
        console.error("Signup failed:", res.message);
        throw new Error("Signup failed");
    }
} */

export { loginGoogle, loginGithub, loginFacebook, logout, /* signUp, signupAction */ };