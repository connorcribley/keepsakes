import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import sendVerificationCode from "@/utils/sendVerificationCode";

export async function POST(req: Request) {
    try {
        const { email } = await req.json();


        if (!email || typeof email !== "string") {
            return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 });
        }


        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        const newCode = Math.floor(100000 + Math.random() * 900000).toString();
        const codeExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10-minute expiry

        await prisma.user.update({
            where: { email },
            data: {
                verificationCode: newCode,
                codeExpiresAt,
            },
        });

        await sendVerificationCode(email, newCode);

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error(err);
        return NextResponse.json({ success: false, message: "Failed to resend code" }, { status: 500 });
    }
}