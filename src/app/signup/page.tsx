import Image from '@/components/Image';
import GoogleSignIn from '@/components/auth/GoogleSignIn';
import GithubSignIn from '@/components/auth/GithubSignIn';
import FacebookSignIn from '@/components/auth/FacebookSignIn';
import CAPTCHASubmit from '@/components/auth/CAPTCHASubmit';
import executeAction from '@/lib/executeAction';
import { auth, signIn } from '@/lib/auth';
import { signUp } from '../actions/auth';
import { redirect } from 'next/navigation';

const SignupPage = async () => {
    // If user is already logged in, redirect back to the homepage
    const session = await auth();
    if (session) redirect('/');

    async function signupAction(formData: FormData) {
        'use server';

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
                    await signIn('credentials', formData)
                }
            })
        } else {
            console.error("Signup failed:", res.message);
            throw new Error("Signup failed");
        }
    }

    return (
        <>
            <div className="absolute inset-0 -z-10">
                <Image
                    src="reports/garage_sale3_tgcldb"
                    alt="Garage Sale Background"
                    width={1920}
                    height={1080}
                    className="w-full h-full object-cover opacity-30"
                />
            </div>
            <div className="flex flex-col items-center text-center justify-center h-full text-white mx-4 sm:mx-8 md:mx-16">
                <div className="bg-zinc-900 text-white w-full  mx-auto p-8 rounded-2xl shadow-lg space-y-6 border border-gray-700 max-w-sm sm:max-w-md">
                    <h2 className="text-2xl font-bold text-center">Sign up to Keepsakes</h2>

                    {/* Social Auth Buttons */}
                    <div className="flex justify-center gap-4">
                        <GoogleSignIn />
                        <GithubSignIn />
                        <FacebookSignIn />
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex-grow border-t border-gray-600" />
                        <span className="text-sm text-gray-400">or</span>
                        <div className="flex-grow border-t border-gray-600" />
                    </div>

                    {/* Form Inputs */}
                    <form
                        id='credentials-signup-form'
                        className="space-y-4"
                        action={signupAction}
                    >
                        <div>
                            <label className="block text-sm text-gray-300 mb-1">Username</label>
                            <input
                                name="name"
                                type="text"
                                placeholder="John Doe"
                                required
                                autoComplete='name'
                                className="w-full bg-zinc-800 border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-300 mb-1">Email</label>
                            <input
                                name='email'
                                type="email"
                                placeholder="johndoe@example.com"
                                required
                                autoComplete='email'
                                className="w-full bg-zinc-800 border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-300 mb-1">Password</label>
                            <input
                                name='password'
                                type="password"
                                placeholder="••••••••"
                                required
                                autoComplete='current-password'
                                className="w-full bg-zinc-800 border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                            />
                        </div>



                        <CAPTCHASubmit
                            formId="credentials-signup-form"
                        />

                    </form>
                    <a href="/login" className='cursor-pointer underline hover:text-orange-400'>Already have an account?</a>
                </div>
            </div>
        </>
    )
};

export default SignupPage
