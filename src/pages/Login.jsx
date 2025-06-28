import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const signIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setError(error ? error.message : null);
  };

  const signUp = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    setError(error ? error.message : 'Check your email for confirmation.');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-2">
      <input
        className="border p-2"
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        className="border p-2"
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      {error && <p className="text-red-600">{error}</p>}
      <div className="flex gap-2">
        <button onClick={signIn} className="bg-blue-600 text-white px-3 py-1 rounded">Sign In</button>
        <button onClick={signUp} className="bg-green-600 text-white px-3 py-1 rounded">Sign Up</button>
      </div>
    </div>
  );
}

export default Login;