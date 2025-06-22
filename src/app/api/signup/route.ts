import { NextResponse } from "next/server";
// import { signIn } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { signupSchema } from "@/lib/schema";
import bcrypt from 'bcrypt';
import sendVerificationCode from "@/utils/sendVerificationCode";

// TODO: Check if email already exists in database

export async function POST(req: Request) {
    try {
        const formData = await req.formData();

        const name = formData.get('name');
        const email = formData.get('email');
        const password = formData.get('password');
        const token = formData.get('g-recaptcha-response')

        // Form data type validation
        if (
            typeof name !== 'string' ||
            typeof email !== 'string' ||
            typeof password !== 'string' ||
            typeof token !== 'string'
        ) {
            return NextResponse.json({ success: false, message: 'Invalid form data' }, { status: 400 })
        }

        // Verify CAPTCHA
        const verifyRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                secret: process.env.RECAPTCHA_SECRET_KEY!,
                response: token,
            }),
        });

        const verifyData = await verifyRes.json();

        if (!verifyData.success) {
            console.error('reCAPTCHA failed:', verifyData['error-codes']);
            return NextResponse.json({ success: false, message: 'Invalid reCAPTCHA' }, { status: 400 });
        }

        // Schema validation
        const validatedData = signupSchema.parse({ name, email, password });
        const hashedPassword = await bcrypt.hash(validatedData.password, 10);


        // Email verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Push to User table in DB
        await prisma.user.create({
            data: {
                name: validatedData.name,
                email: validatedData.email,
                password: hashedPassword,
                image: 'https://res.cloudinary.com/dx83fnzoj/image/upload/v1750111768/user_profiles/default-pfp_wm30df.svg',
                emailVerified: null,
                verificationCode,
                codeExpiresAt: new Date(Date.now() + 10 * 60 * 1000),  // Set 10-minute code expiry
            },
        });

        try {
            await sendVerificationCode(validatedData.email, verificationCode)
        } catch (err) {
            console.error(err)
            return NextResponse.json({ success: false, message: 'Email verification code could not be sent' }, { status: 500 })
        }

        return NextResponse.json({ success: true, email: validatedData.email })
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ success: false, message: 'Signup failed' }, { status: 500 })
    }
}