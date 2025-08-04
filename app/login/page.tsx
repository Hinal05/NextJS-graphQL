"use client";

import { useState, useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { User, LogOut } from "lucide-react";

export default function LoginPage() {
  const { data: session } = useSession();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    if (!res?.ok) {
      setError("Invalid credentials. Please try again.");
    }
  };

  useEffect(() => {
    if (session) {
      console.log("✅ Logged in session:", session);
      console.log("✅ UUID:", session.user?.id);
      console.log("✅ CSRF Token stored:", session.user?.csrfToken);
    }
  }, [session]);

  if (session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-md w-full border border-white/20">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Welcome back!
            </h1>
            <p className="text-gray-600">You're successfully signed in</p>
          </div>

          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mb-6 border border-indigo-100">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-lg">
                  {session.user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-gray-700 font-medium">Signed in as</p>
                <p className="text-indigo-600 font-semibold">
                  {session.user?.name}
                </p>
              </div>
            </div>
          </div>


          <button
            onClick={() => signOut()}
            className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign out</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-md w-full border border-white/20">
        <div className="text-center mb-8">
          <p className="text-gray-600">Sign in to your Drupal account</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            className="..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border px-4 py-3 rounded-xl"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            Sign in
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-2 text-xs text-gray-400">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Secure login via Drupal OAuth</span>
          </div>
        </div>
      </div>
    </div>
  );
}