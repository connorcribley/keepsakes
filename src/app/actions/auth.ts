"use server";

import { signIn, signOut } from "@/lib/auth";

const loginGithub = async () => {
    await signIn("github");
}

const logout = async () => {
    await signOut();
}



export { loginGithub, logout };