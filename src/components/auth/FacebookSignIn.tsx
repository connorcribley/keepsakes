import { loginFacebook } from '@/app/actions/auth';
import { FaFacebook } from 'react-icons/fa';


const FacebookSignIn = () => {
    return (
        <form
            action={loginFacebook}
        >
            <button className="cursor-pointer bg-white text-black rounded-full p-2 hover:opacity-80 transition">
                <FaFacebook className="w-5 h-5" />
            </button>
        </form>
    )
};
export default FacebookSignIn
