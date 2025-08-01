// lib/auth.ts
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Drupal Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/user/login?_format=json`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: credentials?.username,
              pass: credentials?.password,
            }),
          });

          const data = await res.json();
          if (!res.ok || !data?.current_user) return null;

          return {
            id: data.current_user.uid,
            name: data.current_user.name,
            csrf: data.csrf_token,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.csrf) token.csrfToken = user.csrf;
      if (user?.id) token.uid = user.id;
      if (user?.name) token.name = user.name;
      return token;
    },
    async session({ session, token }) {
      if (token?.csrfToken) session.csrfToken = token.csrfToken;
      if (token?.uid) session.uid = token.uid;
      if (token?.name) session.user.name = token.name;
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
};
