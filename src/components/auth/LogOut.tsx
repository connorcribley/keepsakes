import { logout } from "@/app/actions/auth";

const LogOut = () => {
    return (
        <form
            action={logout}
            className="w-full"
        >
            <button
                className="cursor-pointer w-full text-left px-4 py-2 hover:bg-orange-500"
            >
                Logout
            </button>
        </form>
    )
}

export default LogOut;