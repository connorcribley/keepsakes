import { loginGithub } from '@/app/actions/auth';
import { FaGithub } from 'react-icons/fa';


const GithubSignIn = () => {
    return (
        <form
            action={loginGithub}
        >
            <button className="cursor-pointer bg-white text-black rounded-full p-2 hover:hover:bg-orange-400 transition">
                <FaGithub className="w-7 h-7" />
            </button>
        </form>
    )
};
export default GithubSignIn
