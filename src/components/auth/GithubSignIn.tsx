import { loginGithub } from '@/app/actions/auth';
import { FaGithub } from 'react-icons/fa';


const GithubSignIn = () => {
    return (
        <form
            action={loginGithub}
        >
            <button className="cursor-pointer bg-white text-black rounded-full p-2 hover:opacity-80 transition">
                <FaGithub className="w-5 h-5" />
            </button>
        </form>
    )
};
export default GithubSignIn
