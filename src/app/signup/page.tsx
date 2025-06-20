import Image from '@/components/Image';
import SignupForm from '@/components/auth/SignupForm';
import { auth, signIn } from '@/lib/auth';
import { redirect } from 'next/navigation';

const SignupPage = async () => {
    // If user is already logged in, redirect back to the homepage
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
            <div className="flex flex-col items-center text-center justify-center h-full text-white mx-4 sm:mx-8 md:mx-16">
                <div className="bg-zinc-900 text-white w-full  mx-auto p-8 rounded-2xl shadow-lg space-y-6 border border-gray-700 max-w-sm sm:max-w-md">
                    <h2 className="text-2xl font-bold text-center">Sign up to Keepsakes</h2>

                
                    {/* Form Inputs */}
                    <SignupForm />

                    <a href="/login" className='cursor-pointer underline hover:text-orange-400'>Already have an account?</a>
                </div>
            </div>
        </>
    )
};

export default SignupPage
