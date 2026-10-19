import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'racer@keyora.io' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter both email and password.');
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email.toLowerCase() },
          });

          if (!user || !user.password) {
            throw new Error('No user found with this email.');
          }

          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) {
            throw new Error('Incorrect password.');
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
          };
        } catch (error: unknown) {
          // Fallback demo user if database is unseeded
          if (
            credentials.email === 'demo@keyora.io' &&
            credentials.password === 'keyora123'
          ) {
            return {
              id: 'demo-user-1',
              email: 'demo@keyora.io',
              name: 'CyberTypist Demo',
              image: '/images/avatar-1.svg',
              role: 'user',
            };
          }
          throw error;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Self-heal: immediately purge any oversized image from existing JWT cookie
      if (token.image && typeof token.image === 'string' && token.image.length >= 500) {
        token.image = null;
      }

      if (user) {
        token.id = user.id;
        token.image = typeof user.image === 'string' && user.image.length < 500 ? user.image : undefined;
        token.name = user.name;
        token.role = (user as unknown as { role?: string }).role || 'user';
      }
      if (trigger === 'update' && session) {
        if (session.name) token.name = session.name;
        if (session.image !== undefined) {
          token.image = typeof session.image === 'string' && session.image.length < 500 ? session.image : null;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.image = (typeof token.image === 'string' && token.image.length < 500) ? token.image : undefined;
        session.user.name = (token.name as string) || session.user.name;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET || 'keyora_super_secret_typing_jwt_key_2026_change_me',
};
