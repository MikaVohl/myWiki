import React, { useState } from "react";
import { supabase } from "../supabaseClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAuth = async (mode) => {
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setLoading(true);
    setError(null);

    let authError = null;
    if (mode === "signIn") {
      ({ error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      }));
    } else {
      ({ error: authError } = await supabase.auth.signUp({ email, password }));
    }

    if (authError) {
      setError(authError.message);
    } else if (mode === "signUp") {
      setError("Almost there - check your inbox to confirm your email.");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <section className="w-full max-w-md rounded-md border border-gray-200 bg-white p-8 shadow-sm">
        <header className="mb-6 text-center select-none">
          <img
            src="/delta.png"
            alt="myWiki logo"
            className="mx-auto mb-3 h-8 w-8"
          />
          <h1 className="font-serif text-2xl">
            Welcome to <span className="text-blue-600">myWiki</span>
          </h1>
          <p className="text-sm text-gray-500">
            Sign in or create a free account
          </p>
        </header>

        {/* Form */}
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!loading) handleAuth("signIn");
          }}
        >
          <label className="block">
            <span className="sr-only">Email</span>
            <input
              type="email"
              autoComplete="email"
              required
              placeholder="Email address"
              className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className="block">
            <span className="sr-only">Password</span>
            <input
              type="password"
              autoComplete="current-password"
              required
              placeholder="Password"
              className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          {error && (
            <p className="rounded border border-red-100 bg-red-50 p-2 text-sm text-red-600">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Sign In
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => handleAuth("signUp")}
            className="w-full rounded border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Create Account
          </button>
        </form>
      </section>
    </main>
  );
}
