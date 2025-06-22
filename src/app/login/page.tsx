import Image from '@/components/Image';

import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import LoginForm from '@/components/auth/LoginForm';

const LoginPage = async () => {
    const session = await auth();
    if (session) redirect('/');


    return (
        <>
            <div className="absolute inset-0 -z-10">
                <Image
                    src="reports/garage_sale8_di6ida"
                    alt="Garage Sale Background"
                    width={1920}
                    height={1080}
                    className="w-full h-full object-cover opacity-30"
                />
            </div>
            <div className="flex flex-col items-center text-center justify-center h-full text-white mx-4 sm:mx-8 md:mx-16">
                <div className="bg-zinc-900 text-white w-full mx-auto p-8 rounded-2xl shadow-lg space-y-6 border border-gray-700 max-w-sm sm:max-w-md">
                    <h2 className="text-2xl font-bold text-center">Login to Keepsakes</h2>

                    <LoginForm />
                </div>
            </div>
        </>
    )
};

export default LoginPage
