import './App.css'
import { Routes, Route } from 'react-router-dom';
import Page from './pages/Page';
import Login from './pages/Login';
import Home from './pages/Home';
import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return <Login />;
  }

  return (
    <>
      <div className="p-2 flex justify-end">
        <button onClick={() => signOut()} className="text-blue-600">Sign Out</button>
      </div>
      <Routes>
        <Route path="/wiki/:pageName" element={<Page session={session} />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </>
  );
}

async function signOut() {
  console.log('Signing out…');
  const { error } = await supabase.auth.signOut();   // ← await result
  if (error) {
    console.error('Sign-out failed:', error.message);
  }
}

export default App