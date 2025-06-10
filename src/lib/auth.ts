import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "./prisma"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { schema } from "./schema"
import { v4 as uuid } from "uuid"
import { encode } from "next-auth/jwt"


const adapter = PrismaAdapter(prisma)

export const { auth, handlers, signIn, signOut } = NextAuth({
    adapter: adapter,
    providers: [
        Google,
        GitHub,
        Credentials({
            credentials: {
                name: {},
                email: {},
                password: {},
            },
            authorize: async (credentials) => {
                const validatedCredentials = await schema.parse(credentials)

                const user = await prisma.user.findFirst({
                    where: { 
                        name: validatedCredentials.name, 
                        email: validatedCredentials.email, 
                        password: validatedCredentials.password 
                    }
                })

                if (!user) {
                    throw new Error("Invalid credentials")
                }

                return user;
            }
        })
    ],
    callbacks: { 
        async jwt({ token, account }) {
            if (account?.provider === "credentials") {
                token.credentials = true;
            }
            return token;
        }
    },
    jwt: {
        encode: async function (params) {
            if (params.token?.credentials) {
                const sessionToken = uuid();
                
                if (!params.token.sub) {
                    throw new Error("No user ID found in token");
                }

                const createdSession = await adapter?.createSession?.({
                    sessionToken: sessionToken,
                    userId: params.token.sub,
                    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                })

                if (!createdSession) {
                    throw new Error("Failed to create session");
                }

                return sessionToken;
            }
            return encode(params);
        }
    } 
})

//28:00