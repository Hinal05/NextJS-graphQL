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
          const loginRes = await fetch(`${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/user/login?_format=json`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: credentials?.username,
              pass: credentials?.password,
            }),
          });

          const loginData = await loginRes.json();
          if (!loginRes.ok || !loginData?.current_user) return null;

          const uid = loginData.current_user.uid;
          const csrf = loginData.csrf_token;

          const userDetailRes = await fetch(
            `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/jsonapi/user/user?filter[uid]=${uid}`,
            {
              headers: {
                'Content-Type': 'application/vnd.api+json',
                'Accept': 'application/vnd.api+json',
              },
            }
          );

          const userDetail = await userDetailRes.json();
          const uuid = userDetail?.data?.[0]?.id;
          console.log("🔑 UUID from JSON:API:", uuid);

          return {
            id: uuid,
            uid,
            name: loginData.current_user.name,
            csrfToken: csrf,
          };
        } catch (err) {
          console.error('Authorize error:', err);
          return null;
        }
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        console.log("🔁 JWT callback user:", user);
        token.id = user.id;
        token.name = user.name;
        token.csrfToken = user.csrfToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.csrfToken = token.csrfToken;
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
};
