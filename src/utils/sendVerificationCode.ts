import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function sendVerificationCode(email: string, code: string) {
    await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: "Keepsakes Verification Code",
        html: `<p>Your verification code is: <strong>${code}</strong>`
    })
}