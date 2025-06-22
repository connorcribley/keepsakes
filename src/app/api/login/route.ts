import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { loginSchema } from '@/lib/schema';
import bcrypt from 'bcrypt';
import sendVerificationCode from '@/utils/sendVerificationCode'; // adjust import as needed

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();
        const validated = loginSchema.parse({ email, password });

        const user = await prisma.user.findUnique({ where: { email: validated.email } });

        if (!user) {
            return NextResponse.json({ success: false, reason: 'not_found' }, { status: 404 });
        }

        if (!user.password || !(await bcrypt.compare(validated.password, user.password))) {
            return NextResponse.json({ success: false, reason: 'invalid_password' }, { status: 401 });
        }

        if (!user.emailVerified) {
            const code = Math.floor(100000 + Math.random() * 900000).toString();

            await prisma.user.update({
                where: { id: user.id },
                data: {
                    verificationCode: code,
                    codeExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
                },
            });

            await sendVerificationCode(user.email, code);

            return NextResponse.json({
                success: false,
                reason: 'unverified',
                email: user.email,
            });
        }

        return NextResponse.json({ success: true });

    } catch (err) {
        console.error('Login error:', err);
        return NextResponse.json({ success: false, reason: 'server_error' }, { status: 500 });
    }
}