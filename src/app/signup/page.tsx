import Image from '@/components/Image';
import { FaGoogle, FaApple, FaFacebook } from 'react-icons/fa';


const SignupPage = () => {
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
                        <button className="cursor-pointer bg-white text-black rounded-full p-2 hover:opacity-80 transition">
                            <FaApple className="w-5 h-5" />
                        </button>
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
                    <form className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-300 mb-1">Username</label>
                            <input
                                type="text"
                                placeholder="your_username"
                                className="w-full bg-zinc-800 border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-300 mb-1">Email</label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                className="w-full bg-zinc-800 border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-300 mb-1">Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
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
