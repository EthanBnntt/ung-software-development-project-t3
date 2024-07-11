import { PrismaAdapter } from "@auth/prisma-adapter";
import {
	getServerSession,
	type DefaultSession,
	type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { env } from "~/env";
import { db } from "~/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
	interface Session extends DefaultSession {
		user: {
		id?: string;
		} & DefaultSession["user"];
	}
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
	session: {
		strategy: "jwt",
	},
	jwt: {
		secret: env.JWT_SECRET,
	},
	callbacks: {
		jwt: async ({ token, user }) => {
		if (user) {
			token.id = user.id;
		}

		return token;
		},
		session: ({ session, token, user }) => {
		if (token) {
			session.user.id = token.id as string;
		}
		
		return session;
		},
	},
	adapter: PrismaAdapter(db) as Adapter,
	providers: [
		CredentialsProvider({
		name: "Credentials",
		credentials: {
			email: { label: "Email", type: "text" },
			password: { label: "Password", type: "password" },
		},
		authorize: async (credentials) => {
			// Add your own logic here to find the user from the credentials supplied
			const user = await db.user.findUnique({
			where: { email: credentials?.email },
			});

			if (user?.password) {
			const isPasswordValid = await bcrypt.compare(credentials?.password ?? '', String(user?.password ?? ''));
			if (isPasswordValid) {
				// Remove the password field before returning the user object
				const { password, ...userWithoutPassword } = user;

				return userWithoutPassword;
			}
			}

			console.log("Failed to authenticate user", credentials);
			return null;
		}
		}),
	],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
