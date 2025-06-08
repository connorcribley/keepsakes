import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"

export const { auth, handlers, signIn, signOut } = NextAuth({
    providers: [
        GitHub,
        Credentials({
            credentials: {
                username: {},
                email: {},
                password: {},
            },
            authorize: async (credentials) => {
                const username = "admin";
                const email = "admin@admin.com";
                const password = "admin123";

                if (
                    credentials.username === username &&
                    credentials.email === email &&
                    credentials.password === password
                ) return {username, email, password}
                else throw new Error("Invalid credentials");
            }
        })
    ] 
})

//28:00