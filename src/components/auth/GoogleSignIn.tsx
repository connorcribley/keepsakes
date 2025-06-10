import { loginGoogle } from '@/app/actions/auth';
import { FaGoogle } from 'react-icons/fa';


const GoogleSignIn = () => {
  return (
    
        <form
            action={loginGoogle}
        >
            <button className="cursor-pointer bg-white text-black rounded-full p-2 hover:opacity-80 transition">
                <FaGoogle className="w-5 h-5" />
            </button>
        </form>
  )
};

export default GoogleSignIn
