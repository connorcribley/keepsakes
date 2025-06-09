import Image from '@/components/Image';
import { FaGoogle, FaFacebook } from 'react-icons/fa';
import GithubSignIn from '@/components/auth/GithubSignIn';
import { auth } from '@/lib/auth';
import { signUp } from '../actions/auth';
import { redirect } from 'next/navigation';

const SignupPage = async () => {
    const session = await auth();
    if (session) redirect('/');

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
            <div className="flex flex-col items-center text-center justify-center h-full text-white mx-16">
                <div className="bg-zinc-900 text-white w-full max-w-md mx-auto p-8 rounded-2xl shadow-lg space-y-6 border border-gray-700 max-w-2xl">
                    <h2 className="text-2xl font-bold text-center">Sign up to Keepsakes</h2>

                    {/* Social Auth Buttons */}
                    <div className="flex justify-center gap-4">
                        <button className="cursor-pointer bg-white text-black rounded-full p-2 hover:opacity-80 transition">
                            <FaGoogle className="w-5 h-5" />
                        </button>
                        <GithubSignIn />
                        <button className="cursor-pointer bg-white text-black rounded-full p-2 hover:opacity-80 transition">
                            <FaFacebook className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex-grow border-t border-gray-600" />
                        <span className="text-sm text-gray-400">or</span>
                        <div className="flex-grow border-t border-gray-600" />
                    </div>

                    {/* Form Inputs */}
                    <form
                        className="space-y-4"
                        action={async (formData: FormData) => {
                            "use server";

                            const res = await signUp(formData);

                            if (res.success) {
                                redirect("/login");
                            } else {
                                console.log("ERROR!!!!!!! :(")
                            }
                        }}
                    >
                        <div>
                            <label className="block text-sm text-gray-300 mb-1">Username</label>
                            <input
                                name="username"
                                type="text"
                                placeholder="your_username"
                                required
                                autoComplete='username'
                                className="w-full bg-zinc-800 border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-300 mb-1">Email</label>
                            <input
                                name='email'
                                type="email"
                                placeholder="you@example.com"
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

                        <button
                            type="submit"
                            className="cursor-pointer w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition mt-2"
                        >
                            Sign Up
                        </button>
                    </form>
                    <a href="/login" className='cursor-pointer underline hover:text-orange-400'>Already have an account?</a>
                </div>
            </div>
        </>
    )
};

export default SignupPage
