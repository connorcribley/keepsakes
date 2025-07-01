import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import Facebook from "next-auth/providers/facebook"
import Credentials from "next-auth/providers/credentials"
import cloudinary from "./cloudinary"
import { prisma } from "./prisma"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { loginSchema } from "./schema"
import { v4 as uuid } from "uuid"
import { encode } from "next-auth/jwt"
import bcrypt from "bcrypt"
import generateUniqueSlug from "@/utils/generateUniqueSlug"

const adapter = PrismaAdapter(prisma)

export const { auth, handlers, signIn, signOut } = NextAuth({
    adapter: adapter,
    providers: [
        Google,
        GitHub,
        Facebook,
        Credentials({
            credentials: {
                email: {},
                password: {},
            },
            authorize: async (credentials) => {
                const validatedCredentials = await loginSchema.parse(credentials)

                const user = await prisma.user.findFirst({
                    where: {
                        email: validatedCredentials.email
                    }
                })

                if (
                    !user ||
                    !user.password ||
                    !(await bcrypt.compare(validatedCredentials.password, user.password))
                ) {
                    throw new Error("Invalid credentials")
                }

                return user;
            }
        })
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === 'facebook' && profile?.id && account.access_token) {
                user.image = `https://graph.facebook.com/${profile.id}/picture?height=300&width=300&access_token=${account.access_token}`;
            } else if (account?.provider === 'google' && profile?.picture) {
                user.image = profile.picture;
            } else if (account?.provider === 'github' && profile?.avatar_url) {
                user.image = typeof profile.avatar_url === "string" ? profile.avatar_url : "";
            }

            return true;
        },
        // JSON Web Token
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
    },
    events: {
        // Upload profile picture to Cloudinary
        async createUser({ user }) {
            try {
                let imageUrl = user.image;

                // Default Profile Picture
                if (!imageUrl) {
                    imageUrl = 'https://res.cloudinary.com/dx83fnzoj/image/upload/v1750111768/user_profiles/default-pfp_wm30df.svg'
                } else {
                    const uploadResult = await cloudinary.uploader.upload(imageUrl, {
                        folder: "user_profiles",
                        public_id: user.id,
                        overwrite: true,
                    });
                    imageUrl = uploadResult.secure_url;
                }

                // Generate slug from user's name
                const slug = await generateUniqueSlug(user.name || "user");

                await prisma.user.update({
                    where: { id: user.id },
                    data: { 
                        image: imageUrl,
                        slug 
                    },
                });


            } catch (error) {
                console.error("Error in createUser event:", error);
            }
        }
    }
})
