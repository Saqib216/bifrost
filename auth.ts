import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import bcrypt from 'bcryptjs';
import { prisma } from '@/app/lib/prisma';

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: { strategy: 'jwt' },
    providers: [
        Credentials({
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            authorize: async (credentials) => {
                if (!credentials?.email || !credentials?.password) return null;

                const user = await prisma.user.findUnique({
                    where: { email: (credentials.email as string).trim().toLowerCase() },
                });

                if (!user) return null;

                const isValid = await bcrypt.compare(
                    credentials.password as string,
                    user.password
                );

                if (!isValid) return null;

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    image: user.image,
                };
            },
        }),
    ],

    callbacks: {
        jwt: async ({ token, user, trigger, session }) => {
            if (user) {
                token.role = user.role;
                token.id = user.id;
                token.picture = user.image; // built in on NextAuth JWT
            }
            // Allows updating avatar in session without requiring re-login
            if (trigger === 'update' && session?.image) {
                token.picture = session.image;
            }
            return token;
        },
        session: async ({ session, token }) => {
            if (session.user) {
                session.user.role = token.role as string;
                session.user.id = token.id as string;
                session.user.image = (token.picture as string) ?? null;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
});