"use server";

import { logout } from "@/app/actions/auth";

const LogOut = () => {
    return (
        <form
            action={logout}
        >
            <button
                className="hover:text-orange-400 transition cursor-pointer"
            >
                Logout
            </button>
        </form>
    )
}

export default LogOut;