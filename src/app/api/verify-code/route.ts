import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { email, code } = await req.json();

        // Validate types
        if (typeof email !== "string" || typeof code !== "string") {
            return NextResponse.json(
                { success: false, message: "Invalid input" },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        if (!user.verificationCode) {
            return NextResponse.json(
                { success: false, message: "Verification code not found" },
                { status: 404 }
            );
        }

        if (!user.codeExpiresAt) {
            return NextResponse.json(
                { success: false, message: "Verification expiry not found" },
                { status: 404 }
            );
        }

        if (user.verificationCode !== code) {
            return NextResponse.json(
                { success: false, message: "Invalid verification code" },
                { status: 401 }
            )
        }

        if (user.codeExpiresAt < new Date()) {
            return NextResponse.json(
                { success: false, message: "Verification code has expired, please send a new one" },
                { status: 410 }
            );
        }

        await prisma.user.update({
            where: { email },
            data: {
                emailVerified: new Date(),
                verificationCode: null,
                codeExpiresAt: null
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error verifying code:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}