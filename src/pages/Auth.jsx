import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Auth() {
  const [mode, setMode] = useState("signIn"); // "signIn" | "signUp"
  const [identifier, setIdentifier] = useState(""); // username OR email for sign-in
  const [email, setEmail] = useState(""); // e-mail for sign-up
  const [username, setUsername] = useState(""); // username for sign-up
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const qMode = params.get("mode");
    if (qMode === "signUp") setMode("signUp");
    if (qMode === "signIn") setMode("signIn");
  }, [location.search]);

  const toggleMode = () => {
    setMode((m) => (m === "signIn" ? "signUp" : "signIn"));
    setIdentifier("");
    setEmail("");
    setUsername("");
    setPassword("");
    setError(null);
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError(null);

    if (mode === "signIn") {
      if (!identifier || !password) {
        setError("Please enter a username/email and password.");
        return;
      }
      setLoading(true);

      // If the user typed a username, look up the e-mail tied to that username.
      let emailToUse = identifier;
      if (!identifier.includes("@")) {
        const { data: emailFromRpc, error: rpcErr } = await supabase.rpc(
          "email_for_username",
          { uname: identifier }
        );

        if (rpcErr || !emailFromRpc) {
          setError("No account found for that username.");
          setLoading(false);
          return;
        }

        emailToUse = emailFromRpc;
      }

      const { error: signInErr } = await supabase.auth.signInWithPassword({
        email: emailToUse,
        password,
      });
      if (signInErr) setError(signInErr.message);
      setLoading(false);
    } else {
      // sign up
      if (!username || !email || !password) {
        setError("Please enter username, email, and password.");
        return;
      }
      setLoading(true);

      const { error: signUpErr } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username } }, // stores the username in user_metadata
      });

      if (signUpErr) {
        setError(signUpErr.message);
      } else {
        setError("Almost there - check your inbox to confirm your e-mail.");
      }
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen min-w-screen flex items-center justify-center bg-gray-50 px-4">
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
            {mode === "signIn"
              ? "Sign in to your account"
              : "Create a free account"}
          </p>
        </header>

        <form className="space-y-4" onSubmit={handleAuth}>
          {mode === "signIn" ? (
            <label className="block">
              <span className="sr-only">Username or Email</span>
              <input
                type="text"
                required
                placeholder="Username or Email"
                className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </label>
          ) : (
            <>
              <label className="block">
                <span className="sr-only">Username</span>
                <input
                  type="text"
                  required
                  placeholder="Username"
                  className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </label>
              <label className="block">
                <span className="sr-only">Email</span>
                <input
                  type="email"
                  required
                  placeholder="Email address"
                  className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
            </>
          )}

          {/* Password (shared) */}
          <label className="block">
            <span className="sr-only">Password</span>
            <input
              type="password"
              required
              autoComplete={
                mode === "signIn" ? "current-password" : "new-password"
              }
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
            {mode === "signIn" ? "Sign In" : "Create Account"}
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={toggleMode}
            className="w-full rounded border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {mode === "signIn"
              ? "Need an account? Create one"
              : "Already registered? Sign in"}
          </button>
        </form>
      </section>
    </main>
  );
}
