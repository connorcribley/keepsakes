import { loginGoogle } from '@/app/actions/auth';
import { FaGoogle } from 'react-icons/fa';


const GoogleSignIn = () => {
  return (
    
        <form
            action={loginGoogle}
        >
            <button className="cursor-pointer bg-white text-black rounded-full p-2 hover:bg-orange-400 transition">
                <FaGoogle className="w-7 h-7" />
            </button>
        </form>
  )
};

export default GoogleSignIn
