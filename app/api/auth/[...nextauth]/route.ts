import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Drupal Credentials",
      credentials: {
        username: { label: "Username", type: "text" },  // ✅ username not email
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await fetch("http://my-drupal-site.ddev.site/user/login?_format=json", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: credentials?.username,
              pass: credentials?.password,
            }),
          });

          const data = await res.json();
          console.log("Drupal login response:", data);  // This logs on the server!

          if (!res.ok || !data.current_user) {
            return null;
          }

          return {
            id: data.current_user.uid,
            name: data.current_user.name,
            email: "", // Drupal doesn't return email here
          };
        } catch (err) {
          console.error("Auth error:", err);
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };
