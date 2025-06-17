import { loginFacebook } from '@/app/actions/auth';
import { FaFacebook } from 'react-icons/fa';


const FacebookSignIn = () => {
    return (
        <form
            action={loginFacebook}
        >
            <button className="cursor-pointer bg-white text-black rounded-full p-2 hover:hover:bg-orange-400 transition">
                <FaFacebook className="w-7 h-7" />
            </button>
        </form>
    )
};
export default FacebookSignIn
